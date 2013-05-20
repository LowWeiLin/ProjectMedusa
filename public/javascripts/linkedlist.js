/*
 *
 *  Linked List
 *
 */


function LinkedList(_data){
    this.size = 0;
    
    this.head = null;
    this.tail = null;
    
    //Iterator
    this.itr_curr;
    
    return this;
}

function LinkedListNode(_data){
    this.data = _data;
    this.parent = null;
    this.child = null;
    return this;
}

//GetAt, SetAt, RemoveAt, AddToHead, AddToTail, AddAt, At

LinkedList.prototype.AddToHead = function(_data){
    var node = new LinkedListNode(_data);
    node.child = this.head;
    if(this.head == null){
        this.tail = node;
    } else {
        this.head.parent = node;
    }
    this.head = node;
    this.size++;
}

LinkedList.prototype.AddToTail = function(_data){
    var node = new LinkedListNode(_data);
    node.parent = this.tail;
    if(this.tail == null){
        this.head = node;
        this.tail = node;
    }
    this.tail.child = node;
    this.tail = node;
    this.size++;
}

LinkedListNode.prototype.At = function(_index){
    if(_index == 0){
        return this;
    }
    if(this.child == null){
        return null;
    } else {
        return this.child.At(_index-1);   
    }
}

LinkedList.prototype.At = function(_index){
    return this.head.At(_index);
}

LinkedList.prototype.SetAt = function(_index, _data){
    this.At(_index).data = _data;
}

LinkedList.prototype.GetAt = function(_index){
    return this.At(_index).data;
}

LinkedList.prototype.isEmpty = function(){
    if(this.size == 0)
        return true;
    return false;
}

LinkedList.prototype.removeAt = function(_index){
    var temp = this.At(_index);
    if( temp != null){
        if(temp.parent == null){//Has no parent, is head.
            this.head = temp.child;
        } else {
            temp.parent.child = temp.child;
        }
        
        if(temp.child == null){//Has no child, is tail.
            this.tail = this.parent;
        } else {
            temp.child.parent = temp.parent;
        }
        this.size--;
    }
}

LinkedList.prototype.itr_reset = function(){
    this.itr_curr = this.head;
}

LinkedList.prototype.itr_hasnext = function(){
    if(this.itr_curr == null )
        return false;
    else
        return true;
}

LinkedList.prototype.itr_next = function(){
    var temp = this.itr_curr.data;
    this.itr_curr = this.itr_curr.child;
    return temp;
}

LinkedList.prototype.print = function(){
    var curr = this.head;
    while(curr != null){
        console.log(curr.data);
        curr = curr.child;
    }
}

