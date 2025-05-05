import { AuthenticationResult, EventMessage, EventType, InteractionStatus } from '@azure/msal-browser';
import { filter, first, takeUntil, timeout } from 'rxjs/operators';
import { Inject, Injectable, OnDestroy } from '@angular/core';
import { MsalService, MsalBroadcastService, MSAL_GUARD_CONFIG, MsalGuardConfiguration } from '@azure/msal-angular';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AppAuthenticationService implements OnDestroy {
    isIFrame = false;
    isUserAuthenticated = false;
    private readonly _destroying$ = new Subject<void>();

    constructor(
        @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
        private authService: MsalService,
        private msalBroadcastService: MsalBroadcastService
    ) {
        this.isIFrame = window !== window.parent && !window.opener;
        this.setAuthenticationStatus();
        this.checkAndSetActiveAccount();
        this.setAuthenticationCallbacks();
    }

    isEmployeeAuthenticated(): Promise<any> {
        const loginSuccessEvents: EventType[] = [
            EventType.LOGIN_SUCCESS,
            EventType.ACQUIRE_TOKEN_SUCCESS
        ];

        const filterCondition = this.isUserAuthenticated
            ? (item: EventMessage) => item.eventType === EventType.HANDLE_REDIRECT_END
            : (item: EventMessage) => loginSuccessEvents.includes(item.eventType);

        return this.msalBroadcastService.msalSubject$
            .pipe(
                filter(filterCondition),
                timeout(20000),
                first()
            )
            .toPromise()
            .catch(this.handleAuthenticationError);
    }

    setAuthenticationCallbacks() {
        // Also explicitly type the array here
        const loginSuccessEvents: EventType[] = [
            EventType.LOGIN_SUCCESS,
            EventType.ACQUIRE_TOKEN_SUCCESS
        ];

        this.msalBroadcastService.msalSubject$
            .pipe(
                filter((msg: EventMessage) => loginSuccessEvents.includes(msg.eventType)),
                takeUntil(this._destroying$)
            )
            .subscribe((result: EventMessage) => {
                const payload = result.payload as AuthenticationResult;
                this.authService.instance.setActiveAccount(payload.account);
            });

        this.msalBroadcastService.inProgress$
            .pipe(
                filter((status: InteractionStatus) => status === InteractionStatus.None),
                takeUntil(this._destroying$)
            )
            .subscribe(() => {
                this.setAuthenticationStatus();
            });
    }

    checkAndSetActiveAccount() {
        let activeAccount = this.authService.instance.getActiveAccount();
        if (!activeAccount && this.authService.instance.getAllAccounts().length > 0) {
            let accounts = this.authService.instance.getAllAccounts();
            this.authService.instance.setActiveAccount(accounts[0]);
        }
    }

    setAuthenticationStatus() {
        this.isUserAuthenticated = this.authService.instance.getAllAccounts().length > 0;
    }

    ngOnDestroy(): void {
        this._destroying$.next();
        this._destroying$.complete();
    }

    getActiveAccount() {
        if (this.isEmployeeAuthenticated) {
            return this.authService.instance.getActiveAccount();
        }
    }

    private handleAuthenticationError(error: any): Promise<never> {
        console.error('Authentication handling error:', error);
        return Promise.reject(error);
    }

    login() {
        this.authService.loginRedirect();
    }
}
