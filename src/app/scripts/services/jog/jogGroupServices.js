app
    .factory('jogGroupCommonService', ['$rootScope', '$q', 'form',
        function ($rootScope, $q, form) {
            return function (api, params) {
                var delay = $q.defer();
                var url = rungroupDomain + "/" + form.userData.userId + "/" + form.userData.session + api;

                $.ajax({
                    type: form.postType,
                    url: url,
                    data: params,
                    timeout: 600000,
                    context: document.body,
                    success: function(res) {
                        delay.resolve(res);
                    },
                    error: function(err) {
                        $rootScope.getReadyStateMsg(err.status);
                        delay.reject();
                    }
                });

                return delay.promise;
            };
        }
    ])
    //创建跑团
    .factory('createGroupService', ['jogGroupCommonService',
        function (jogGroupCommonService) {
            return function(params) {
                return jogGroupCommonService(createGroupApi, params);
            };
        }
    ])
    //获取推荐跑团
    .factory('getRecommendGroupsService', ['jogGroupCommonService',
        function (jogGroupCommonService) {
            return function(params) {
                return jogGroupCommonService(getRecommendGroupsAPi, params);
            };
        }
    ])
    //获取跑团列表
    .factory('getGroupListService', ['jogGroupCommonService',
        function (jogGroupCommonService) {
            return function(params) {
                return jogGroupCommonService(getGroupListApi, params);
            };
        }
    ])
    //获取跑团信息
    .factory('getGroupInfoService', ['jogGroupCommonService',
        function (jogGroupCommonService) {
            return function(params) {
                return jogGroupCommonService(getGroupInfoApi, params);
            };
        }
    ])
    //加入跑团
    .factory('joinGroupService', ['jogGroupCommonService',
        function (jogGroupCommonService) {
            return function(params) {
                return jogGroupCommonService(joinGroupApi, params);
            };
        }
    ])
    //取消加入
    .factory('cancelJoinService', ['jogGroupCommonService',
        function (jogGroupCommonService) {
            return function(params) {
                return jogGroupCommonService(cancelJoinApi, params);
            };
        }
    ])
    //退出跑团
    .factory('exitGroupService', ['jogGroupCommonService',
        function (jogGroupCommonService) {
            return function(params) {
                return jogGroupCommonService(exitGroupApi, params);
            };
        }
    ])
    //接受加入跑团
    .factory('acceptJoinGroupService', ['jogGroupCommonService',
        function (jogGroupCommonService) {
            return function(params) {
                return jogGroupCommonService(acceptJoinGroupApi, params);
            };
        }
    ])
    //拒绝加入跑团
    .factory('refuseJoinGroupService', ['jogGroupCommonService',
        function (jogGroupCommonService) {
            return function(params) {
                return jogGroupCommonService(refuseJoinGroupApi, params);
            };
        }
    ])
    //团长变更
    .factory('updateGroupLeadService', ['jogGroupCommonService',
        function (jogGroupCommonService) {
            return function(params) {
                return jogGroupCommonService(updateGroupLeadApi, params);
            };
        }
    ])
    //获取跑团排行
    .factory('getGroupRankService', ['jogGroupCommonService',
        function (jogGroupCommonService) {
            return function(params) {
                return jogGroupCommonService(getGroupRankApi, params);
            };
        }
    ])
    //获取成员排行
    .factory('getMemberRankService', ['jogGroupCommonService',
        function (jogGroupCommonService) {
            return function(params) {
                return jogGroupCommonService(getMemberRankApi, params);
            };
        }
    ])
    //获取成员列表
    .factory('getMemberListService', ['jogGroupCommonService',
        function (jogGroupCommonService) {
            return function(params) {
                return jogGroupCommonService(getMemberListApi, params);
            };
        }
    ])
    //移除成员
    .factory('delMemeberService', ['jogGroupCommonService',
        function (jogGroupCommonService) {
            return function(params) {
                return jogGroupCommonService(delMemeberApi, params);
            };
        }
    ])
    //分享团信息
    .factory('shareGroupMessageService', ['jogGroupCommonService',
        function (jogGroupCommonService) {
            return function(params) {
                return jogGroupCommonService(saveShareMessageApi, params);
            };
        }
    ])
    //是否已申请加入跑团
    .factory('getStatusUserInGroupService', ['jogGroupCommonService',
        function (jogGroupCommonService) {
            return function(params) {
                return jogGroupCommonService(getStatusUserInGroupApi, params);
            };
        }
    ])
    //是否已申请加入跑团
    .factory('getMessageService', ['jogGroupCommonService',
        function (jogGroupCommonService) {
            return function(params) {
                return jogGroupCommonService(getMessageApi, params);
            };
        }
    ])
    //删除跑团消息
    .factory('delMessageService', ['jogGroupCommonService',
        function (jogGroupCommonService) {
            return function(params) {
                return jogGroupCommonService(delMessageApi, params);
            };
        }
    ]);
