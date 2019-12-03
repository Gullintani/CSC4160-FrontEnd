<template>
  <div>
    <div id="canvas" style="height:100%; width:100%; position:absolute"></div>
  </div>
</template>


<script>
import axios from 'axios'
export default {
  name: 'HelloWorld',
  data: function(){
        return{
            dataset: undefined,
            fuck: 'fuck'
        }
  },
  methods: {
    getData_test(){
        this.dataset = require('../assets/test.json').data
    },
    getData(){
        axios.get('http://10.21.38.20:8080/log/data?limit=500')
        .then(response => {this.dataset = response.data.data})
        .catch(err => console.log("something wrong"+err))
    },
    drawChart() {
        axios.get('http://10.21.38.20:8080/log/data?limit=100')
        .then(response => {
        var data = response.data.data
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById("canvas"));
        // 指定图表的配置项和数据
        
        var by_label = {}
        var pointsData = [];
        var labels = []
        data.forEach(
            function(line){
                let locations = by_label[line.securityTag] || [];
                locations.push([[line.userLongi, line.userLati],[line.serverLongi, line.serverLati]]);
                by_label[line.securityTag] = locations;
                //
                pointsData.push([line.userLongi, line.userLati]);
                pointsData.push([line.serverLongi, line.serverLati]);
                //
                if(labels.indexOf(line.securityTag) == -1){
                    labels.push(line.securityTag);
                }
            }
        );

        //color settings
        function TypeToColour(label) {
            if(label == "normal."){
                return '#0000FF'
            }
            if(label == "smurf."){
                return '#FF1493'
            }
            if(label == "neptune."){
                return '#DC143C'
            }
            return '#696969'
        }

        var series = labels.map(function (label) {
            var routes = by_label[label];
            var type_color = TypeToColour(label);
            if(!routes){
                return null;
            }
            return{
                type: 'lines3D',
                name: label,
                effect: {
                        show: true,
                        trailWidth: 3,
                        trailLength: 0.15,
                        trailOpacity: 1,
                        trailColor: 'rgb(30, 30, 60)'
                },

                lineStyle: {
                    width: 1,
                    color: type_color,
                    // color: 'rgb(50, 50, 150)',
                    // color: 'rgb(118, 233, 241)',
                    opacity: 0.2
                },
                blendMode: 'lighter',

                data: routes
        };
        }).filter(function (series) {
            return !!series;
        });

        series.push({
            name: 'City Info',
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
            title: {
            text: 'Cloud-Based Real Time Network Analysis System ',
            subtext: 'By. Eric the Leader, Lingo, Patrick the Welkinson, Cloud and Welkin\nReal time data from lgulife.com',
            x: 'right',
            textStyle: {
                color: '#ccc',
                fontSize: 24
            },
            subtextStyle:{
                fontSize: 18
            },
            link: 'https://github.com/L-kcirtaP/onechina',
            sublink: 'https://www.lgulife.com/'
            },
            legend: {
                selectedMode: 'single',
                left: 'left',
                data: Object.keys(by_label),
                orient: 'vertical',
                textStyle: {
                    color: '#fff'
                }
            },
            tooltip:{
                show: true,
                trigger: 'item',
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
                    roughness: 0.6,
                    metalness: 0,
                    // roughness: ROOT_PATH + 'asset/get/s/data-1497599804873-H1SHkG-mZ.jpg',
                    // metalness: ROOT_PATH + 'asset/get/s/data-1497599800643-BJbHyGWQW.jpg',
                    // textureTiling: [8, 4]
                },
                postEffect: {
                    enable: true,
                    bloom:true,
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
        })
    }
    
  },
  created(){
    //   this.getData()
    //   this.getData_test()
  },
  mounted() {
      this.drawChart()
  }
}
</script>