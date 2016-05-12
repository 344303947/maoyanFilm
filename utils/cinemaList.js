import React, {
    AppRegistry,
    Component,
    StyleSheet,
    Text,
    View,
    ListView,
    TouchableOpacity,
    ScrollView
} from 'react-native';

import Toolbar from "./Toolbar";
var _data;
export default class cinemaList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
                sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
            }),
        }
    }
    componentDidMount() {
        this.fetchData();
    }
    fetchData() {
        var url = "http://m.maoyan.com/cinemas.json";
        fetch(url)
            .then((response) => response.json())
            .then((responseData) => {
                _data = responseData.data;
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRowsAndSections(responseData.data),
                    //  dataHeader:responseData.data
                })
            })
    }
    render() {
        return (
            <View style={styles.container}>              
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={this._renderCinema}
                    renderSectionHeader={this._renderHeader}
                    style={styles.ListView}
                    />
            </View>

        )
    }
    _renderCinema(rowData, sectionId, rowId) {
        
        return (
            <TouchableOpacity style={styles.cinemaRow}>
                <View style={styles.nameView}>
                    <Text style={styles.nameText}>{rowData.nm}</Text>
                    <View style={styles.sateView}>
                        <Text style={styles.sateText}>座</Text>
                    </View>
                </View>
                <Text style={styles.addrText}>{rowData.addr}</Text>
            </TouchableOpacity>
        )
    }
    _renderHeader(sectionData, sectionId) {
        console.log(sectionId)
        return (
            <View style={styles.regionView}>
                <Text style={styles.regionText}>{sectionId}</Text>
            </View>
        );
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
    regionView: {
        height: 40,
        backgroundColor: "#fff",
        flexDirection: "row",
        alignItems: "center",
        fontSize:16,
        paddingLeft:20
    },
    regionText:{
        fontSize:16,        
    },
    cinemaRow:{
      borderColor:"#ddd",
      borderTopWidth:1, 
      padding:15,
    },
    nameView:{
        flexDirection:"row",   
        justityContent:"center"             
    },
    nameText:{
         fontSize:17,         
    },
    addrText:{
        color:"#999",
        marginTop:10,
    },
    
    sateView:{
        backgroundColor:"#d92d2d",
        borderRadius:2, 
        width:16,   
        alignSelf:"center"             
    },
    sateText:{
        color:"#fff",
        textAlign:"center",
        fontSize:10,
    }
});