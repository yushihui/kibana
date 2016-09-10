define(function(require) {
    require('plugins/kibana/report/css/main.css');
    const _ = require('lodash');
    //const uiTree = require('angular-ui-tree');
    require('bootstrap');
    require('ui/filters/start_from');
    require('ui/modules').get('apps/report', [])
        .controller('reportCtrl', function($scope, timefilter,sv) {
            timefilter.enabled = false;
            $scope.curReport = null;
            $scope.reportURL ="http://"+sv+":8080/jsp/reportTree.jsp"
            $scope.showReport = function(node) {
                $scope.curNode = node;
            }
            $scope.list = [{
                "id": 1,
                "title": "node1",
                "nodes": [{
                    "id": 11,
                    "title": "node1.1",
                    "nodes": [{
                        "id": 111,
                        "title": "node1.1.1",
                        "uri": "http://localhost:5601/app/kibana#/dashboard/dash1?embed=true&_g=(refreshInterval:(display:Off,pause:!f,value:0),time:(from:now-15m,mode:quick,to:now))&_a=(filters:!(),options:(darkTheme:!f),panels:!((col:1,id:CPU-%E4%BD%BF%E7%94%A8%E7%8E%87%EF%BC%88RDUser%EF%BC%89,panelIndex:1,row:1,size_x:3,size_y:2,type:visualization),(col:4,id:RDUser-%E5%86%85%E5%AD%98%E4%BD%BF%E7%94%A8%E7%8E%87,panelIndex:2,row:1,size_x:3,size_y:2,type:visualization),(col:7,id:RDUser-%E7%BD%91%E7%BB%9C%E6%8E%A5%E6%94%B6%E9%80%9F%E7%8E%87,panelIndex:3,row:1,size_x:3,size_y:2,type:visualization)),query:(query_string:(analyze_wildcard:!t,query:'*')),title:dash1,uiState:())",
                        "nodes": []
                    }]
                }, {
                    "id": 12,
                    "title": "node1.2",
                    "uri":"http://localhost:5601/goto/2693486f1ae5d3a2b1bde8c697f5b265",
                    "nodes": []
                }]
            }, {
                "id": 2,
                "title": "node2",
                "nodrop": true,
                "nodes": [{
                    "id": 21,
                    "title": "node2.1",
                    "nodes": []
                }, {
                    "id": 22,
                    "title": "node2.2",
                    "nodes": []
                }]
            }, {
                "id": 3,
                "title": "node3",
                "nodes": [{
                    "id": 31,
                    "title": "node3.1",
                    "nodes": []
                }]
            }];

        }).filter('trustAsResourceUrl', ['$sce', function($sce) {
            return function(val) {
                return $sce.trustAsResourceUrl(val);
            };
        }]);

    require('ui/routes')
        .when('/report', {
            template: require('plugins/kibana/report/app.html'),
        });




});
