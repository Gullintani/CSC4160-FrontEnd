<template>
  <div>
    <div id="canvas" style="height:100%; width:100%; position:absolute"></div>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data() {
    //   data:[]
  },
  methods: {
    getData(){

    },
    drawChart() {
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById("canvas"));
        // 指定图表的配置项和数据
        var data = require('../assets/flight.json')
        var airports = data.airports.map(
            function(item){
                return {coord: [item[3], item[4]]} //points format
            }
        );
      
        function getAirportCoord(idx) {
            return [data.airports[idx][3], data.airports[idx][4]];
        }

    // Route: [airlineIndex, sourceAirportIndex, destinationAirportIndex]
        var routesGroupByAirline = {};
        data.routes.forEach(
            function (route) {
                var airline = data.airlines[route[0]];
                var airlineName = airline[0];
                if(!routesGroupByAirline[airlineName]){routesGroupByAirline[airlineName] = [];}
                routesGroupByAirline[airlineName].push(route);
            }
        );

        var pointsData = [];
        data.routes.forEach(function (airline) {
            pointsData.push(getAirportCoord(airline[1]));
            pointsData.push(getAirportCoord(airline[2]));
        });

        //color settings
        function AirlineToColour(airline) {
            if(airline == "Secure Access"){
                return '#0000CD'
            }
            if(airline == "Malicious Access"){
                return '#DC143C'
            }
            return '#7CFC00'
        }

        var series = data.airlines.map(function (airline) {
            var airlineName = airline[0];
            var routes = routesGroupByAirline[airlineName];
            var AirColor = AirlineToColour(airlineName);
            if(!routes){
                return null;
            }

            return{
                type: 'lines3D',
                name: airlineName,

                effect: {
                        show: true,
                        trailWidth: 3,
                        trailLength: 0.15,
                        trailOpacity: 1,
                        trailColor: 'rgb(30, 30, 60)'
                },

                lineStyle: {
                    width: 1,
                    color: AirColor,
                    // color: 'rgb(50, 50, 150)',
                    // color: 'rgb(118, 233, 241)',
                    opacity: 0.2
                },
                blendMode: 'lighter',

                data: routes.map(function (item) {
                    return [airports[item[1]].coord, airports[item[2]].coord];
                })
        };
        }).filter(function (series) {
            return !!series;
        });

        series.push({
            type: 'scatter3D',
            coordinateSystem: 'globe',
            blendMode: 'lighter',
            symbolSize: 5,
            itemStyle: {
                color: 'rgb(51,153,253)',
                opacity: 0.2
            },
            data: pointsData
        });

        myChart.setOption({
            legend: {
                selectedMode: 'single',
                left: 'left',
                data: Object.keys(routesGroupByAirline),
                orient: 'vertical',
                textStyle: {
                    color: '#fff'
                }
            },
            globe: {
                baseTexture: require('../assets/geo.jpg'),
                environment: require('../assets/starfield2.jpg'),
                heightTexture: require('../assets/bathymetry_bw_composite_4k.jpg'),
                // heightTexture: require('../assets/bathymetry_bw_composite_4k.jpg'),
                
                displacementScale: 0.2,
                displacementQuality: 'high',
                // baseColor: '#000',

                shading: 'realistic',
                realisticMaterial: {
                    roughness: 1,
                    metalness: 0,
                    // roughness: ROOT_PATH + 'asset/get/s/data-1497599804873-H1SHkG-mZ.jpg',
                    // metalness: ROOT_PATH + 'asset/get/s/data-1497599800643-BJbHyGWQW.jpg',
                    // textureTiling: [8, 4]
                },
                postEffect: {
                    enable: true,
                    depthOfField: {
                        enable: false,
                        focalDistance: 150
                    }
                },
                temporalSuperSampling: {
                    enable: true
                },
                light: {
                    ambient: {
                        intensity: 0.1
                    },
                    main: {
                        intensity: 1,
                        shadow: true
                    },
                    ambientCubemap: {
                        texture: require('../assets/pisa.png'),//require('../assets/lake.hdr'),
                        exposure: 1,
                        diffuseIntensity: 0.5,
                        specularIntensity: 2
                    }
                },
                viewControl: {
                    autoRotate: false
                },
                silent: true
            },
            series: series
        });
        window.addEventListener('keydown', function () {
            series.forEach(function (series, idx) {
                myChart.dispatchAction({
                    type: 'lines3DToggleEffect',
                    seriesIndex: idx
                });
            })
        });
        }
  },
  mounted() {
      this.drawChart()
  }
}
</script>