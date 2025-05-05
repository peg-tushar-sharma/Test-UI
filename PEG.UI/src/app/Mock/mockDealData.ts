
export const mockDealData: any = {
        "dealId": 52,
        "targetName": "test",
        "industries": [],
        "sectors": [],
        "subSectors": [],
        "clientName": null,
        "targetID": 0,
        "industryID": 0,
        "submittedBy": "42VRU",
        "dealRegistrations": [],
        "createdOn": null,
        "bankRunningProcess": null,
        "currentEBITDA": null,
        "dealSize": null,
        "targetDescription": null,
        "isPubliclyKnown": null,
        "nickname": null,
        "notes": "",
        "owner": null,
        "targetCountry": null,
        "associatedRegistrations": null,
        "mbAdvisor": [],
        "mbStatus": 0,
        "sector": null,
        "externalProjectName": null,
        "visibleTo": "",
        "biddersList": null,
        "dealWinner": null,
        "dealStatus": 1,
        "bidDates": null,
        "bidDatesType": null,
        "vddProvider": null,
        "redbookAvailable": null,
        "managedBy": "42VRU",
        "expertGroup": [
          {
            "expertGroupId": 166,
            "dealId": 52,
            "expertGroupName": "Primary Experts",
            "expertGroupNote": null,
            "experts": [
              {
                "expertId": 349,
                "expertGroupId": 0,
                "employeeCode": "01REU",
                "expertName": "Steinberg, Reuven (BOS)",
                "categoryId": 0,
                "categoryName": null,
                "expertCategory": null,
                "bainOffice": "Boston",
                "note": "",
                "levelName": "M",
                "gradeName": "7",
                "title": "Expert Associate Partner",
                "expertIndustries": "",
                "expertClients": "",
                "industries": [
                  {
                    "industryId": 2326,
                    "industryName": ""
                  }
                ],
                "clients": [
                  {
                    "clientId": 1277,
                    "clientName": ""
                  }
                ],
                "lastUpdatedBy": null,
                "isExternalEmployee": false,
                "expertState": 0,
                "isAllocationActive": false
              }
            ],
            "submittedBy": null,
            "expertPoolColor": {
              "expertPoolColorId": 1,
              "colorName": "Magenta",
              "colorCode": "#FF6AEE",
              "lastUpdatedBy": null,
              "lastUpdatedDate": null
            }
          }
        ],
        "clients": [
          {
            "dealClientId": 83,
            "registrationId": 0,
            "projectLead": null,
            "clientHeads": [],
            "clientSectorLeads": [],
            "othersInvolved": [],
            "client": {
              "clientId": 1521,
              "clientName": "Triton Advisors",
              "clientHeadEmployeeCode": null,
              "clientHeadFirstName": null,
              "clientHeadLastName": null,
              "clientPriorityId": null,
              "clientPriorityName": null,
              "clientPrioritySortOrder": null,
              "clientReferenceId": 0
            },
            "stage": null,
            "seekingExpertise": "",
            "registrationStatus": null,
            "priority": {
              "priorityId": 4,
              "priorityName": "P2",
              "sortOrder": 4
            },
            "notes": "",
            "submittedBy": "42VRU",
            "committed": [],
            "heardFrom": [],
            "nextCall": [],
            "ovp": [],
            "registrationSubmittedBy": "",
            "registrationSubmitterLocation": null,
            "registrationSubmitterEcode": null,
            "allocationNote": "",
            "probabilityToConvertToSale": 76,
            "possibleStartDateRangeFrom": null,
            "possibleStartDateRangeTo": null,
            "staffingProjectIn": null,
            "callDates": null,
            "registrationSubmissionDate": null,
            "dealThesis": null,
            "caseCode": null,
            "svp": [],
            "workType": null,
            "workEndDate": null,
            "phaseZeroStartDate": null,
            "phaseZeroEndDate": null,
            "phaseOneStartDate": null,
            "phaseOneEndDate": null,
            "phaseTwoStartDate": null,
            "phaseTwoEndDate": null,
            "terminatedDate": null,
            "interestDate": null,
            "commitmentDate": null,
            "lostTo": null,
            "callLog": null,
            "projectName": null,
            "dealStage": null,
            "clientOrder": 100
          }
        ],
        "clientAllocations": [],
        "importantDates": [],
        "submissionDate": "2020-05-20T11:22:54.027Z",
        "dealRegions": [],
        "dealSecurity": [],
        "dealSecurityInfo": null,
        "dealSecurityDetails": [],
        "priorWork": null,
        "transactedTo": null,
        "supportedWinningBidder": null,
        "processExpectation": null,
        "supportRequested": false,
        "expertLineupPrepared": false,
        "expertOnBoard": false,
        "transactedDate": null,
        "publiclyTraded": false,
        "isExpertTrainUpCall": false,
        "dateOfCall": null,
        "trainers": [],
        "attendees": [],
        "sentTo": []
}

export const mockMBStatus: any = [
    {
      "mbStatusId": 1,
      "mbStatusName": "Single Registration"
    },
    {
      "mbStatusId": 2,
      "mbStatusName": "Potential MB"
    },
    {
      "mbStatusId": 3,
      "mbStatusName": "Active MB"
    },
    {
      "mbStatusId": 4,
      "mbStatusName": "Potential sell-side/buy-side"
    },
    {
      "mbStatusId": 5,
      "mbStatusName": "Potential sell-side/MB buy-side"
    },
    {
      "mbStatusId": 6,
      "mbStatusName": "Active sell-side/buy-side"
    },
    {
      "mbStatusId": 7,
      "mbStatusName": "Active sell-side/MB buy-side"
    }
  ]

export const mockSecurityConfig = [
  {
    "name":"DealInformation",
    "tabName":"ContextTab",
    "dealSectionId":1,
    "dealTabId":1,
    "isTabVisible":true,
    "isVisible":true,
    "isEditable":true,
    "isNone":false
  },
  {
    "name":"Deal Process",
    "tabName":"ContextTab",
    "dealSectionId":2,
    "dealTabId":1,
    "isTabVisible":true,
    "isVisible":true,
    "isEditable":true,
    "isNone":false
  },
  {
    "name":"Bain Information/History",
    "tabName":"ContextTab",
    "dealSectionId":3,
    "dealTabId":1,
    "isTabVisible":true,
    "isVisible":true,
    "isEditable":true,
    "isNone":false
  },
  {
    "name":"ExpertGroups",
    "tabName":"ExpertsTab",
    "dealSectionId":4,
    "dealTabId":2,
    "isTabVisible":true,
    "isVisible":true,
    "isEditable":true,
    "isNone":false
  },
  {
    "name":"Experts",
    "tabName":"ExpertsTab",
    "dealSectionId":5,
    "dealTabId":2,
    "isTabVisible":true,
    "isVisible":true,
    "isEditable":true,
    "isNone":false
  },
  {
    "name":"Clients",
    "tabName":"ClientsTab",
    "dealSectionId":6,
    "dealTabId":3,
    "isTabVisible":true,
    "isVisible":true,
    "isEditable":true,
    "isNone":false
  }
  ,{
    "name":"Allocation",
    "tabName":"AllocationTab",
    "dealSectionId":7,
    "dealTabId":4,
    "isTabVisible":true,
    "isVisible":true,
    "isEditable":true,
    "isNone":false
  },
  {
    "name":"Header",
    "tabName":"HeaderTab",
    "dealSectionId":8,
    "dealTabId":5,
    "isTabVisible":true,
    "isVisible":true,
    "isEditable":true,
    "isNone":false
  }]

export const mockDealStatus = [
  {
    "dealStatusId":1,
    "dealStatusName":"Coming to Market"
  },
  {
    "dealStatusId":2,
    "dealStatusName":"Active"
  },
  {
    "dealStatusId":3,
    "dealStatusName":"Transacted"
  },
  {
    "dealStatusId":4,
    "dealStatusName":"Process Died"
  },
  {
    "dealStatusId":5,
    "dealStatusName":"Cold"
  }
]

export const mockDealFromRegistration = {
  "dealId": 0,
  "targetName": "waterlogic",
  "targetId": 0,
  "submittedBy": null,
  "clientName": null,
  "dealRegistrations": [
    {
      "registration": {
        "nid": "R2422",
        "id": 2422,
        "wti": 4,
        "wtn": "Buy Side (Corporate M&A)",
        "ci": "930",
        "cdn": "Pentair",
        "cpi": "",
        "cpn": "",
        "cpso": 0,
        "chdn": null,
        "tdn": "waterlogic",
        "ti": 4918,
        "lsd": "2018-02-05T06:00:00Z",
        "td": null,
        "ic": "Commitment",
        "sp": null,
        "hfc": false,
        "pte": false,
        "ptd": false,
        "hfcdn": "No",
        "ptedn": "No",
        "pn": "Viking",
        "l": null,
        "bo": "Washington, D.C.",
        "boc": null,
        "sti": 1,
        "stn": "Cleared",
        "sgTI": 2,
        "sgTN": "Commitment",
        "cr": "Castik Capital",
        "iomp": false,
        "cd": null,
        "sd": "2019-09-09T06:00:00Z",
        "ceD": null,
        "imb": true,
        "wts": 0,
        "ln": "Email from Michael \"Active as interest. We completed our initial outside-in work last year\" - awaiting more info. Outside-in, no access to internal or proprietary info",
        "co": null,
        "indi": 2260,
        "in": "Water treatment",
        "ws": null,
        "ch": "Robbins, Michael (WAS)",
        "csl": "",
        "oi": "Degwekar, Aakash (SIN); Shklyar, Natan (NYC)",
        "sr": null,
        "gn": null,
        "sb": "Sion, Michael (WAS)",
        "rt": 1,
        "srAprv": null,
        "csldn": null,
        "oidn": null,
        "wtsdn": "",
        "sbn": "Sion, Michael (WAS)-01SIO",
        "sraprvcd": null,
        "tl": null,
        "tln": "Dublin, Ireland",
        "lud": "2019-09-09T06:00:00Z",
        "isImpersonated": false,
        "hasDeal": false,
        "so": null,
        "son": "Washington, D.C.",
        "lodi": null,
        "lodn": "",
        "ism": false,
        "ec": 1,
        "ie": 1,
        "chwec": "Robbins, Michael (WAS)-12MRO",
        "cslwec": "",
        "oiwec": "Degwekar, Aakash (SIN)-15ABD; Shklyar, Natan (NYC)-12NSH",
        "sraprvwAbbr": null,
        "lodr": 0,
        "drn": null
      }
    }
  ],
  "createdOn": null,
  "bankRunningProcess": null,
  "currentEBITDA": null,
  "dealSize": null,
  "targetDescription": null,
  "isPubliclyKnown": null,
  "nickname": null,
  "notes": null,
  "owner": "Castik Capital",
  "targetCountry": "",
  "associatedRegistrations": null,
  "mbAdvisor": null,
  "mbStatus": null,
  "sector": null,
  "externalProjectName": null,
  "visibleTo": null,
  "biddersList": null,
  "dealWinner": null,
  "dealStatus": null,
  "bidDates": null,
  "bidDatesType": null,
  "priorWork": "",
  "vddProvider": null,
  "redbookAvailable": null,
  "industries": [],
  "expertGroup": [],
  "clients": [
    {
      "committed": [],
      "heardFrom": [],
      "nextCall": [],
      "ovp": [],
      "possibleStartDateRangeTo": null,
      "callDates": [],
      "registrationSubmissionDate": "2018-02-05T06:00:00Z",
      "workEndDate": null,
      "phaseZeroStartDate": null,
      "phaseZeroEndDate": null,
      "phaseOneStartDate": null,
      "phaseOneEndDate": null,
      "phaseTwoStartDate": null,
      "phaseTwoEndDate": null,
      "interestDate": null,
      "commitmentDate": null,
      "terminatedDate": null,
      "client": {
        "clientId": "930",
        "clientName": "Pentair",
        "clientHeadEmployeeCode": "Robbins, Michael (WAS)",
        "clientHeadFirstName": null,
        "clientHeadLastName": "",
        "ClientPriorityId": 0,
        "ClientPriorityName": "",
        "clientReferenceId": 0
      },
      "clientHeads": [
        {
          "employeeCode": "12MRO",
          "firstName": " Michael ",
          "familiarName": "",
          "lastName": "Robbins",
          "partnerWorkTypeName": "",
          "region": null,
          "searchableName": "Robbins, Michael (WAS)",
          "officeAbbreviation": "WAS"
        }
      ],
      "clientSectorLeads": [],
      "othersInvolved": [
        {
          "employeeCode": "15ABD",
          "firstName": " Aakash ",
          "familiarName": "",
          "lastName": "Degwekar",
          "partnerWorkTypeName": "",
          "region": null,
          "searchableName": "Degwekar, Aakash (SIN)",
          "officeAbbreviation": "SIN"
        },
        {
          "employeeCode": "12NSH",
          "firstName": " Natan ",
          "familiarName": "",
          "lastName": " Shklyar",
          "partnerWorkTypeName": "",
          "region": null,
          "searchableName": " Shklyar, Natan (NYC)",
          "officeAbbreviation": "NYC"
        }
      ],
      "registrationSubmittedBy": "Sion, Michael (WAS)",
      "registrationSubmitterEcode": "01SIO",
      "registrationSubmitterLocation": "Washington, D.C.",
      "registrationId": 2422,
      "registrationStatus": {
        "registrationStatusId": 1,
        "statusTypeName": "Cleared"
      },
      "stage": {
        "registrationStageId": 2,
        "stageTypeName": "Commitment"
      },
      "notes": "",
      "priority": {
        "priorityId": "",
        "priorityName": "",
        "sortOrder": 100
      },
      "priorityId": "",
      "priorityName": "",
      "dealClientId": 0,
      "workType": {
        "workTypeId": 4,
        "workTypeName": "Buy Side (Corporate M&A)"
      },
      "clientOrder": 3
    }
  ],
  "clientAllocations": [],
  "importantDates": [],
  "managedBy": "15ELL",
  "dealRegions": [],
  "dealSecurity": [],
  "supportedWinningBidder": null,
  "expertLineupPrepared": null,
  "supportRequested": false,
  "expertOnBoard": false,
  "processExpectation": null,
  "transactedTo": null,
  "transactedDate": null,
  "submissionDate": null,
  "sectors": [],
  "subSectors": [],
  "dateOfCall": null,
  "isExpertTrainUpCall": false,
  "publiclyTraded": false,
  "attendees": null,
  "sentTo": null,
  "trainers": null
}