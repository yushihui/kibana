import $ from 'jquery';

import UiModules from 'ui/modules';
import ConfigTemplate from 'ui/ConfigTemplate';

export default function(chrome, internals) {

    require('ui/notify');
    UiModules
        .get('kibana')
        .directive('kbnChrome', function($rootScope) {
            return {
                template($el) {
                    const $content = $(require('ui/chrome/chrome.html'));
                    const $app = $content.find('.application');

                    if (internals.rootController) {
                        $app.attr('ng-controller', internals.rootController);
                    }

                    if (internals.rootTemplate) {
                        $app.removeAttr('ng-view');
                        $app.html(internals.rootTemplate);
                    }

                    return $content;
                },

                controllerAs: 'chrome',
                controller($scope, $rootScope, $location, $http, sv, $interval, Notifier) {

                    const notify = new Notifier({
                        location: 'Sharpview'
                    });

                    let ack = function(id) {
                        $http.delete('/api/alerts/ack/' + id).then(function(json) {

                        }, function(error) {
                            console.log(error);
                        });
                    }

                    let processAlert = function(alerts) {
                        // let result=_.countBy(alerts, 'level');
                        let result = _.groupBy(alerts, 'level');

                        if (result['4']) {
                            notify.error(result['4'][0].message + " -- " + result['4'].length + " critical alert(s)", function() {
                                console.log("ACK" + alerts[0]);
                                ack(result['4'][0].sampleId);
                            });
                        }
                        if (result['3']) {
                            notify.warning(result['3'][0].message + " -- " + result['3'].length + " warning alert(s)", function() {
                                console.log("ACKM" + alerts[0]);
                            });
                            //notify.warning(result['3'] +" warning alert(s)");
                        }


                    }


                    let alertService = $interval(function() {
                        $http.get('/api/alerts').then(function(json) {
                            processAlert(json.data.alerts);
                            //notify.info("getAlerts:"+json.data.alerts.length);
                        }, function(error) {
                            console.log(error);
                        });
                    }, 40 * 1000)

                    $rootScope.sv = sv;

                    // are we showing the embedded version of the chrome?
                    internals.setVisibleDefault(!$location.search().embed);

                    // listen for route changes, propogate to tabs
                    const onRouteChange = function() {
                        let { href } = window.location;
                        let persist = chrome.getVisible();
                        internals.trackPossibleSubUrl(href);
                        internals.tabs.consumeRouteUpdate(href, persist);
                    };

                    $rootScope.$on('$routeChangeSuccess', onRouteChange);
                    $rootScope.$on('$routeUpdate', onRouteChange);
                    onRouteChange();

                    // and some local values
                    chrome.httpActive = $http.pendingRequests;
                    $scope.notifList = require('ui/notify')._notifs;
                    $scope.appSwitcherTemplate = new ConfigTemplate({
                        switcher: '<app-switcher></app-switcher>'
                    });

                    return chrome;
                }
            };
        });

}
