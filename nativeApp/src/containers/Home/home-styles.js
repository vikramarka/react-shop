import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  home: {
    backgroundColor: '#f7f7f7',
  },
	banner: {
		backgroundColor: '#6c6c6c',
		paddingTop: 25,
		paddingBottom: 25,
		paddingLeft: 50,
		paddingRight: 50,
		flex:1,
		justifyContent: 'flex-start',
		alignItems: 'flex-start',
	},
	img: {
		width: null, 
		height: 300, 
		flex:1,
	},
	h1: {
		fontSize: 36,
		fontWeight: '700',
		color: '#fff',
		marginBottom: 10, 
	},
	h2: {
		fontSize: 22,
		fontWeight: '700',
		color: '#fff', 
		marginBottom: 10,
	},
	black: {		
		color: '#2e2e2e', 
	},
	red: {
		color: '#f62f5e',
	},
	white: {
		color: '#fff',
	},
	button: {
		backgroundColor: '#f62f5e',
		fontSize:18,
		fontWeight: '700',
		color: '#fff',
		borderRadius: 20,
		paddingTop: 15,
		paddingBottom: 15,
		paddingLeft: 30,
		paddingRight: 30,
		textAlign: 'center',
		minWidth: 150, 
	},
	shop_now_panel:{
		margin:15,
		marginBottom: 30,
		padding: 25,
		backgroundColor: '#fff',
		position: 'relative',
		shadowColor: '#000',
  		shadowOffset: {width: 0, height: 2},
  		shadowOpacity: 0.8,
  		shadowRadius: 2,
		elevation: 5,
	},
	product_panel:{
		flex:1,
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'column',
	},
	sale:{
		backgroundColor: '#00d3ca',
		color:'#fff',
		paddingTop: 5,
		paddingBottom: 5,
		paddingLeft: 10,
		paddingRight: 10,
		width: 'auto',
		position: 'absolute',
		left: 0,
		top: 0,
		zIndex: 1,
		fontSize: 16,
		fontWeight: '400',
		},
	shop_now: {
		textAlign: 'center',
		display:'flex',
		flex:1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	shoptxt: {
		marginBottom:15,
		textAlign:'center',
		fontSize: 16,
		fontWeight: '400',
	},
	wow_block: {
		backgroundColor: '#00d3ca',
		padding: 15,
		margin: 15,
		marginBottom: 30, 
		minHeight: 345,
		flex:1,
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
	},
	game_begin_img_block: {
		marginLeft: 15,
		marginRight: 15,
		marginTop: 15,
	},
	game_sub_block: {
		marginLeft:15,
		marginRight: 15,
		marginTop: 0,
		marginBottom: 40,
		padding: 30,
		backgroundColor: '#fff',
		position: 'relative',
		shadowColor: '#000',
  		shadowOffset: {width: 0, height: 2},
  		shadowOpacity: 0.8,
  		shadowRadius: 2,
		elevation: 5,
	},
	center: {
		textAlign: 'center',
	},
	
	/* product page */
	
	body: {
		backgroundColor: '#eeeeee',
		paddingTop: 30,
		paddingBottom: 30,
	},
	item: {
		backgroundColor: '#fff',
		padding: 25,
		margin: 15,
		paddingBottom: 40,
		position: 'relative',
		textAlign: 'center',
		marginBottom: 30,
		flex:1,
		alignItems: 'center',
		justifyContent: 'center',
		shadowColor: '#000',
  		shadowOffset: {width: 0, height: 10},
  		shadowOpacity: 0.8,
		shadowRadius: 2,
		elevation: 6, 
	},
	price: {
		fontWeight: 'bold',
		fontSize: 18,
		marginBottom: 15,
	},
	
	/* Topblock styles */
	
	topbar:{
		backgroundColor: '#f7f7f7',
		paddingTop:10,
		paddingBottom: 10,
		paddingLeft: 15,
		paddingRight:15,
		flexDirection: 'row',
		justifyContent:'space-between',
		alignItems:'center',
	},
	topleft:{
		flex:1,
		flexDirection: 'row',
	},
	toptext:{
		fontSize:15,
		fontWeight: '700',
		color:'#000',
	},
	signin:{
		fontSize:15,
		fontWeight: '700',
		color:'#f62f5e',
		marginLeft: 10,
	},
	cart_block:{
		position:'relative',
	},
	cartcount:{
		color:'#fff',
		backgroundColor:'#f62f5e',
		position:'absolute',
		top:50,
		width:25,
		height:30,
	},
	
	/* Cart page css */
	
	cart_page_wraper:{
		padding: 15,
	},
	cart_top_block:{
		backgroundColor: '#fff',
		paddingTop:20,
		paddingBottom:20,
		paddingLeft:15,
		paddingRight:15,
	},
	cart_single_block:{
		flex:1,
		flexDirection:'row',
		justifyContent:'space-between',
		flexWrap:'wrap',
		textAlign: 'left',
		alignItems:'center',
	},
	product_img:{
		padding:10,
		borderWidth:1,
		borderColor:'#b4b4b4',
		marginRight:15, 
	},
	img_right_block:{
		flex:1,
		flexDirection:'row',
		flexWrap:'wrap',
		justifyContent:'center',
		alignItems:'center',
	},
	cart_bottom_block:{
		backgroundColor:'#efefef',
		paddingTop:20,
		paddingBottom:20,
		paddingLeft:15,
		paddingRight:15,
		marginBottom: 20,
		flex:1,
		flexDirection:'row',
		justifyContent:'space-between',
	},
	cart_size_block:{
		flex:1, 
		justifyContent:'space-between',
		flexDirection:'row',
		marginTop: 15,
	},
});