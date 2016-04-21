import React, {
    AppRegistry,
    Component,
    StyleSheet,
    Text,
    View,
    ToolbarAndroid,
    ListView,
    Image,
    TouchableOpacity,
    WebView,
    ScrollView
} from 'react-native';


export default class filmInfo extends Component {
    constructor(props, params) {
        super(props);
        this.state = {
            dataSource: null,
            filmData: null
        }
    }
    componentDidMount() {
        this.fetchData();
    }
    fetchData() {
        var url = "http://m.maoyan.com/movie/" + this.props.id + ".json";
        fetch(url)
            .then((response) => response.json())
            .then((responseData) => {
                this.setState({
                    dataSource: responseData.data.CommentResponseModel.hcmts,
                    filmData: responseData.data.MovieDetailModel
                })

            })
    }
    render() {
        if (!this.state.dataSource) {
            return (
                <View></View>
            );
        } else {
            return (
                <View style={styles.container}>
                    <Toolbar {...this.props} navigator={this.props.navigator} />
                    <ScrollView  contentContainerStyle={styles.scrollView}>
                        <View style={styles.content}>
                            <FilmDetail filmData={this.state.filmData} />
                            <Comments dataSource={this.state.dataSource} />
                        </View>
                    </ScrollView>
                </View>
            )
        }
    }

}

// toolbar
class Toolbar extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <View style={styles.toolbar}>
                <TouchableOpacity style={styles.backIcon}  onPress={this.back.bind(this) }></TouchableOpacity>
                <Text style={styles.title}>{this.props.name}</Text>
            </View>
        )
    }
    back() {
        this.props.navigator.pop();
    }
}

// info

class FilmDetail extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        var data = this.props.filmData || {};
        var verText = data.ver || '';
        verText = verText.replace(/[\u4e00-\u9fa5]+/g, '').replace(/\/$/, '');
        var dra = data.dra || "";
        dra = dra.replace(/<p>/, '').replace(/<\/p>/, '');

        return (
            <View style={styles.detailWrap}>
                <View style={styles.detailView}>
                    <Image source={{ uri: data.img }} style={styles.filmCover}></Image>
                    <View style={styles.infoView}>
                        <Text style={styles.name}>{data.nm}</Text>
                        <View style={styles.verWrap}>
                            <View style={styles.verView}>
                                <Text style={styles.verText}>{verText}</Text>
                            </View>
                        </View>
                        <View style={styles.scoreView}>
                            <Text style={styles.score}>{data.sc}分</Text>
                            <Text style={styles.snum}>({data.snum}人评分) </Text>
                        </View>

                        <Text style={styles.textLineHeight}>{data.cat}</Text>
                        <Text style={styles.textLineHeight}>{data.src}/{data.dur}分钟</Text>
                        <Text style={styles.textLineHeight}>{data.rt}</Text>
                    </View>
                </View>
                <View style={styles.draView}>
                    <View style={styles.bigBtn} >
                        <Text style={styles.bigBtnText}>立即购票</Text>
                    </View>
                    <Text>{dra}</Text>
                </View>
                <View style={styles.navView}>
                    <Text style={styles.navTitle}>演员表</Text>
                    <Text>{data.star}</Text>
                </View>
            </View>
        )
    }
}

class Comments extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
        }
    }
    componentDidMount() {
        if (!this.props.dataSource) return;
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this.props.dataSource),
        });
    }
    render() {
        return (
            <View>
                <View style={styles.navView}>
                    <Text style={styles.navTitle}>短评</Text>
                    <ListView
                        dataSource={this.state.dataSource}
                        renderRow={this.renderComments}
                        style={styles.commentRows}
                        />
                </View>
            </View>
        )
    }

    renderComments(data) {
        var star = ~~data.score;
        var arr = [];
        for (var i = 0; i < star; i++) {
            arr.push(i)
        }
        return (
            <View style={styles.comments}>
                <View style={styles.starView}>
                    <View style={styles.stars}>
                        {
                            arr.map(function (i) {
                                return <Image source={require('../images/star.png') } style={styles.starIcon}></Image>
                            })                            
                        }
                           
                    </View>
                    <Text>{data.time}</Text>
                </View>
                <Text style={styles.commentsText}>{data.content}</Text>
                <View style={styles.userView}>
                    <Image source={{ uri: data.avatarurl }} style={styles.avatar}></Image>
                    <Text style={styles.nickName}>{data.nickName}</Text>
                </View>
            </View>
        )
    }

}

var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#eee",
        flexDirection:"column"

    },
    scrollView: {
        height: 1800,
    },
    toolbar: {
        height: 40,
        backgroundColor: "#e54847",
        alignItems: 'center',
        flexDirection: 'row'
    },

    backIcon: {
        borderLeftWidth: 1,
        borderTopWidth: 1,
        height: 12,
        width: 12,
        borderColor: "#fff",
        marginLeft: 10,
        transform: [{ rotate: "-45deg" }]
    },
    content: {
        flex: 1,
    },
    filmCover: {
        width: 108,
        height: 148,
        borderWidth: 1,
        borderColor: "#fff"
    },
    title: {
        flex: 1,
        color: "#fff",
        textAlign: "center",
    },
    scoreView: {
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    score: {
        fontSize: 18,
        color: "#ff9a00",
    },
    snum: {
        color: "#ff9a00",
    },
    detailWrap: {
        flexDirection: "column",
    },
    detailView: {
        flexDirection: 'row',
        height: 170,
        padding: 10,
        backgroundColor: "#55514c"
    },
    name: {
        fontSize: 18,
        color: "#fff"
    },
    infoView: {
        flex: 1,
        paddingLeft: 10,
        flexDirection: 'column',
    },
    verView: {
        backgroundColor: "#2895db",
        borderRadius: 2,
        paddingLeft: 5,
        paddingRight: 5,
    },
    verText: {
        color: "#fff",
        fontSize: 10,
    },
    verWrap: {
        flexDirection: "row",
    },
    textLineHeight: {
        color: "#fff",
        lineHeight: 24
    },
    draView: {
        padding: 10,
        backgroundColor: "#fff",
        borderColor: "#e1e1e1",
        borderBottomWidth: 1,
        borderTopWidth: 1
    },
    bigBtn: {
        backgroundColor: "#e54847",
        borderRadius: 2,
        justifyContent: "center",
        padding: 5,
        marginBottom: 10
    },
    bigBtnText: {
        color: "#fff",
        textAlign: "center",
    },
    navView: {
        padding: 10,
        marginTop: 10,
        backgroundColor: "#fff",
        borderColor: "#e1e1e1",
        borderBottomWidth: 1,
        borderTopWidth: 1,
        flex: 1,
        flexDirection: 'column'
    },
    navTitle: {
        lineHeight: 30
    },
    commentRows: {

    },
    comments: {
        paddingTop: 20,
        paddingBottom: 10,
        borderTopWidth: 1,
        borderColor: "#ddd"
    },
    commentsText: {
        marginTop: 10,
        marginBottom: 10,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20
    },
    userView: {
        flexDirection: 'row',
        alignItems: "center"
    },
    nickName: {
        marginLeft: 10
    },
    starIcon: {
        width: 10,
        height: 10,
    },
    starView: {
        flexDirection: "row",
        justifyContent: 'space-between'
    },
    starText: {
        color: "#ff9a00",
    },
    stars:{
        flexDirection:'row'
    }
})