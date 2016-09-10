module.exports = function(kbnServer, server, config) {
    var _ = require('lodash');

    var requestHandler = require('request')


    server.route({
        method: 'GET',
        path: '/api/alerts',
        handler: async function(request, reply) {
            var data = await getSharpviewAlerts();
            return reply({
                alerts: data.list
            });
        }
    });

    server.route({
        method: 'Delete',
        path: '/api/alerts/ack/{sampleID}',
        handler: function(request, reply) {
            var sid = request.params.urlId;

            requestHandler('http://10.16.33.206:8080/services/recentAlerts/ack/' + sid, function() {

            });
            //var data= await getSharpviewAlerts();
            return reply({
                data: true
            });
        }
    });



    function getSharpviewAlerts() {
        return new Promise((resolve, reject) => {
            requestHandler('http://10.16.33.206:8080/services/recentAlerts/list', (err, res, body) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(JSON.parse(body));
            });
        });
    }



};
