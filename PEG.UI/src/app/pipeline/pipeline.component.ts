import { Component, OnInit } from '@angular/core';
import { fieldAuth } from '../shared/common/fieldAuth';
import { CoreService } from '../core/core.service';
import { PipelineService } from './pipeline.service';

@Component({
  selector: 'app-pipeline',
  templateUrl: './pipeline.component.html',
  styleUrls: ['./pipeline.component.scss']
})
export class PipelineComponent implements OnInit {

  public groupDefaultExpanded;
  public fieldAuth: fieldAuth = new fieldAuth();
  regionFilter: any;

  constructor(public _coreService: CoreService, public _pipelineService: PipelineService) {

  }

  ngOnInit(): void {
  }

}