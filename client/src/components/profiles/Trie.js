  
class Node{    
	constructor(){
		this.isEnd = false ;
		this.child = [] ;
		for( var i=0;i<26;i++ ) {
			this.child[i] = null ;
		}
	}
}
export default  class Trie{	
	constructor(){
		this.root = new Node() ;
		this.list = [] ;
	}	
	add( str ) {
		let curr = this.root ;
		for( var i=0;i<str.length;i++ ) {
			var index = str.charCodeAt(i) - 97 ;
			if( index<0 ) continue;
			if( curr.child[index]==null ) curr.child[index] = new Node() ;
			curr = curr.child[index] ;	
		}
		curr.isEnd = true ;
	}
	helper( curr , postfix , prefix ) {
		if( curr.isEnd==true ) 
			this.list.push(prefix+postfix) ;
		for( var i=0;i<26;i++ ) 
			if( curr.child[i]!=null ) {
				postfix += 'abcdefghijklmnopqrstuvwxyz'.charAt(i);
				this.helper( curr.child[i] , postfix , prefix ) ;
				postfix = postfix.substring( 0 , postfix.length-1 ) ;
			}
	}
	findPostFix( prefix ) {
		this.list = [] ;
		let curr = this.root ;
		for( var i = 0 ;i<prefix.length;i++ ) {
			var index = prefix.charCodeAt( i )-97 ;
			if( curr.child[index]==null ) return -1 ;
			curr = curr.child[index] ;
		}
		this.helper( curr , "" , prefix ) ;
		return curr ;
	}
}
//Head is Created her to make its scope Global .
// const head = new Trie();
// head.add("dharmesh");
// head.add("dharmehh");
// head.add("dharmeshdharmes");
// head.add("dharresh");
// head.add("dharmedd");


// head.add("upadhyay");
// head.add("soumya");
// head.add("pandey");
// head.add("lalit");
// head.add("dubey");
// head.findPostFix('dhar')
// console.log(head.list)
// head.findPostFix('soum')
// console.log(head.list)
