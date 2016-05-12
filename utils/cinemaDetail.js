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
var date = new Date();
var month = date.getMonth()+1;
month = (month)<10?"0"+month:month;
var initDate = date.getFullYear()+"-"+month+"-"+date.getDate();
export default class cinemaDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
            data: null
        }
    }
    componentDidMount() {
        this.fetchData();
    }
    fetchData() {
        var url = "http://m.maoyan.com/showtime/wrap.json?cinemaid=" + this.props.id;
        fetch(url)
            .then((response) => response.json())
            .then((responseData) => {
                data = responseData.data;
               
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
        // var data = this.state.data;
        console.log(data)
        if (!data) {
            return (
                <View><ProgressBarAndroid  color="red" styleAttr='Inverse'/></View>
            )
        }

        var cinemaDetailModel = data.cinemaDetailModel;
        // 影院信息
        var cinemaInfo =
            <View style={styles.cinemaInfo}>
                <Text>{cinemaDetailModel.addr}</Text>
                <Text>{cinemaDetailModel.tel[0] || ""}</Text>
            </View>
        var currentMovieModel = data.currentMovie;
        // 当前电影
        var currentMovie =
            <View style={styles.movieView}>
                <Image source={{ uri: currentMovieModel.img }} style={styles.movieImgCur}></Image>
            </View>
        // 所有电影
        var moviesModel = data.movies;
        var movies = []
        for (var i = 1; i < moviesModel.length; i++) {
            movies.push(
                <View style={styles.movieView}>
                    <Image source={{ uri: moviesModel[i].img }} style={styles.movieImg}></Image>
                </View>
            )
        }
        // 日期
        var dateModel = data.Dates;
        var dateView = [];
        for (var i = 0; i < dateModel.length; i++) {
            if (i == 0) {
                dateView.push(
                    <View style={[styles.dateView, styles.dateViewCur]} date={dateModel[i].slug}>
                        <Text style={styles.dateTextCur}>{dateModel[i].text}</Text>
                    </View>
                )
            } else {
                dateView.push(
                    <View style={styles.dateView} date={dateModel[i].slug}>
                        <Text style={styles.dateText}>{dateModel[i].text}</Text>
                    </View>
                )
            }
        }
        // 场次
        var showModel = data.DateShow[initDate];
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
         this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(showModel),
                })
        return (
            <View>
                {cinemaInfo}
                <ScrollView style={styles.movieScroll} horizontal={true}>
                    {currentMovie}
                    {movies}
                </ScrollView>
                <View style={styles.movieNameView}>
                    <Text style={styles.movieNameText}>{currentMovieModel.nm}</Text>
                </View>
                <ScrollView style={styles.dateScroll} horizontal={true} showsHorizontalScrollIndicator={false}>
                    {dateView}
                </ScrollView>

                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={this._renderCinemaDetail}
                    style={styles.ListView}
                    />
            </View>

        )
    }
    _renderCinemaDetail(showModel) {

        return (
             <View style={styles.showModel}>
                    <View>
                        <Text>{showModel[i].tm}</Text>
                        <Text>{showModel[i].end}</Text>
                    </View>
                    <View>
                        <Text>{showModel[i].lang}</Text><Text>{showModel[i].tp}</Text>
                        <Text>{showModel[i].th}</Text>
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
    ListView: {
        flex: 1,
    },

    cinemaInfo: {
        padding: 10
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
    },
    movieNameText: {
        fontSize: 16,
        fontWeight: "bold"
    },
    dateScroll: {
        padding: 10,
        backgroundColor: "#aaa",
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
    showScroll:{
        flex:1
    }
});