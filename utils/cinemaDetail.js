import React, {
    Component,
    StyleSheet,
    Text,
    View,
    ListView,
    TouchableOpacity,
    ScrollView,
    Image,
    ProgressBarAndroid,
} from 'react-native';

import Toolbar, {ToolbarHome} from "./Toolbar";

var id, name, data;
var moiveIndex = 0, dataIndex = 0;
var date = new Date();
var month = date.getMonth() + 1;
month = (month) < 10 ? "0" + month : month;
var initDate = date.getFullYear() + "-" + month + "-" + date.getDate();
export default class cinemaDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
            data: null,
            index:0
        }
    }
    componentDidMount() {
        this.fetchData();
    }
    fetchData() {
        var url = "http://m.maoyan.com/showtime/wrap.json?cinemaid=" + this.props.id + "&movieid=";
        fetch(url)
            .then((response) => response.json())
            .then((responseData) => {
                data = responseData.data;
                var showModel = data.DateShow[initDate];

                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(showModel),
                    data: responseData.data
                })
            })
    }
    render() {
        return (
            <View style={styles.container}>
                <Toolbar {...this.props} navigator={this.props.navigator} />
                {this.renderInfo() }
            </View>
        )
    }
    renderInfo() {
        var data = this.state.data;
        console.log(data)
        if (!data) {
            return (
                <View><ProgressBarAndroid  color="red" styleAttr='Inverse'/></View>
            )
        }

        // 影院信息
        var cinemaDetailModel = data.cinemaDetailModel;
        var cinemaInfo =
            <View style={styles.cinemaInfo}>
                <Text>{cinemaDetailModel.addr}</Text>
                <Text>{cinemaDetailModel.tel[0] || ""}</Text>
            </View>

        // 当前电影
        var currentMovieModel;
        
        // 所有电影
        var moviesModel = data.movies;
        var movies = []
        for (var i = 0; i < moviesModel.length; i++) {
            var _index = (i+1);
            if (i == moiveIndex) {
                currentMovieModel = moviesModel[i];
                movies.push(
                    <TouchableOpacity style= { styles.movieView } >
                        <Image source={{ uri: moviesModel[i].img }} style={styles.movieImgCur}></Image>
                    </TouchableOpacity>
                )
                continue;
            }
            movies.push(
                <TouchableOpacity style={styles.movieView} onPress={this._onPressMovie.bind(this)}  ref={()=>{_index}}>
                    <Image source={{ uri: moviesModel[i].img }} style={styles.movieImg}></Image>
                </TouchableOpacity>
            )
        }
        // 日期
        var dateView = [];
        var dateModel = data.Dates;
        for (var i = 0; i < dateModel.length; i++) {
            if (i == dataIndex) {
                dateView.push(
                    <TouchableOpacity style={[styles.dateView, styles.dateViewCur]} date={dateModel[i].slug}  >
                        <Text style={styles.dateTextCur}>{dateModel[i].text}</Text>
                    </TouchableOpacity>
                )
                continue;
            }
            dateView.push(
                <TouchableOpacity style={styles.dateView} date={dateModel[i].slug}  >
                    <Text style={styles.dateText}>{dateModel[i].text}</Text>
                </TouchableOpacity>
            )
        }
        // 场次

        // var dateModel = data.Dates;
        // var showModel = data.DateShow[initDate];
        // var showView = [];
        // for (var i in showModel) {
        //     showView.push(
        //         <View style={styles.showModel}>
        //             <View>
        //                 <Text>{showModel[i].tm}</Text>
        //                 <Text>{showModel[i].end}</Text>
        //             </View>
        //             <View>
        //                 <Text>{showModel[i].lang}</Text><Text>{showModel[i].tp}</Text>
        //                 <Text>{showModel[i].th}</Text>
        //             </View>
        //         </View>
        //     )
        // }
        // console.log(showModel)

        return (
            <View style={styles.content}>
                {cinemaInfo}
                <View>
                    <ScrollView style={styles.movieScroll} horizontal={true} >
                        {movies}
                    </ScrollView>
                </View>
                <View style={styles.movieNameView}>
                    <Text style={styles.movieNameText}>{currentMovieModel.nm}</Text>
                </View>
                <View>
                    <ScrollView style={styles.dateScroll} horizontal={true} showsHorizontalScrollIndicator={false}>
                        {dateView}
                    </ScrollView>
                </View>
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={this._renderCinemaDetail}
                    style={styles.ListView}
                    />
                {/* 
    */}
            </View>

        )
    }
    _onPressMovie(){
        //    moiveIndex =_index;
           console.log(this.refs)
            // this.setState({
            //   index:_index  
            // })
    }
    _onPressDate(){
           dateIndex = this.props._index;
    }
    
    _renderCinemaDetail(showModel) {
        return (
            <View style={styles.showModel}>
                <View style={styles.timeView}>
                    <Text style={styles.timeStart}>{showModel.tm}</Text>
                    <Text style={styles.timeEnd}>{showModel.end}结束</Text>
                </View>
                <View style={styles.thView}>
                    <View style={styles.langView}>
                        <Text>{showModel.lang}</Text><Text>{showModel.tp}</Text>
                    </View>
                    <Text>{showModel.th}</Text>
                </View>
                <View style={styles.priceView}>
                    {/* 返回的价格有问题，这里写死一个价格 */}
                    <Text style={styles.sellText}>38</Text>
                    <Text style={styles.priceText}>原价100</Text>
                </View>
                <View style={styles.buyView}>
                    <TouchableOpacity style={styles.buyButton}>
                        <Text style={styles.buyText}>选座购票</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
    
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#eee",
    },
    content: {
        flex: 1,
    },
    cinemaInfo: {
        padding: 10,
        backgroundColor: "#fff"
    },
    movieScroll: {
        height: 124,
        backgroundColor: "#333",
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 3,
        paddingRight: 3,
        flexDirection: "row"
    },
    movieView: {
        paddingRight: 10,
    },

    movieImg: {
        width: 75,
        height: 104,
    },
    movieImgCur: {
        width: 75,
        height: 104,
        borderWidth: 2,
        borderColor: "#fff"
    },
    movieNameView: {
        padding: 10,
        backgroundColor: "#fff"
    },
    movieNameText: {
        fontSize: 16,
        fontWeight: "bold"
    },
    dateScroll: {
        padding: 10,
        borderColor: "#ddd",
        borderTopWidth: 1,
        borderBottomWidth: 1,
        flexDirection: "row",
        justityContent: "center"
    },
    dateView: {
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 5,
        paddingBottom: 8
    },
    dateViewCur: {
        backgroundColor: "#df2d2d",
        borderRadius: 18
    },
    dateTextCur: {
        color: "#fff"
    },
    showModel: {
        flex: 1,
        flexDirection: "row",
        justityContent: "center",
        alignItems: "center",
        padding: 10,
        borderColor: "#eee",
        borderWidth: 1,
        backgroundColor: "#fff"
    },
    timeView: {
        flex: 1,
        width: 80,
    },
    thView: {
        flex: 2,
        alignItems: "center",
    },
    timeStart: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#df2d2d",
        texAlign: "center",
    },
    timeEnd: {
        fontSize: 12
    },
    langView: {
        flexDirection: "row",
        alignItems: "center",
    },
    priceView: {
        flex: 1,
        alignItems: "center",
    },
    sellText: {
        fontSize: 20,
        color: "#df2d2d",
    },
    priceText: {
        textDecorationLine: 'line-through',
        fontSize: 10,
    },
    buyView: {
        flex: 1,
        alignItems: "center",
    },
    buyButton: {
        padding: 4,
        backgroundColor: "#df2d2d",
        borderRadius: 2,
    },
    buyText: {
        fontSize: 10,
        color: "#fff",
        textAlign: "center"
    },
    ListView: {
        flex: 1
    }
});