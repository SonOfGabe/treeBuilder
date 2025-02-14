// Copyright 2011 David Galles, University of San Francisco. All rights reserved.
//
// Redistribution and use in source and binary forms, with or without modification, are
// permitted provided that the following conditions are met:
//
// 1. Redistributions of source code must retain the above copyright notice, this list of
// conditions and the following disclaimer.
//
// 2. Redistributions in binary form must reproduce the above copyright notice, this list
// of conditions and the following disclaimer in the documentation and/or other materials
// provided with the distribution.
//
// THIS SOFTWARE IS PROVIDED BY <COPYRIGHT HOLDER> ``AS IS'' AND ANY EXPRESS OR IMPLIED
// WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
// FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> OR
// CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
// SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
// ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
// NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
// ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
// The views and conclusions contained in the software and documentation are those of the
// authors and should not be interpreted as representing official policies, either expressed
// or implied, of the University of San Francisco

function AVL(am, w, h)
{
	this.init(am, w, h);

}

AVL.prototype = new Algorithm();
AVL.prototype.constructor = AVL;
AVL.superclass = Algorithm.prototype;


// Various constants

AVL.HIGHLIGHT_LABEL_COLOR = "#FF0000"
AVL.HIGHLIGHT_LINK_COLOR =  "#FF0000"

AVL.HIGHLIGHT_COLOR = "#007700"
AVL.HEIGHT_LABEL_COLOR = "#007700"


AVL.LINK_COLOR = "#007700";
AVL.HIGHLIGHT_CIRCLE_COLOR = "#007700";
AVL.FOREGROUND_COLOR = "0x007700";
AVL.BACKGROUND_COLOR = "#DDFFDD";
AVL.PRINT_COLOR = AVL.FOREGROUND_COLOR;

AVL.WIDTH_DELTA  = 50;
AVL.HEIGHT_DELTA = 50;
AVL.STARTING_Y = 50;

AVL.FIRST_PRINT_POS_X  = 50;
AVL.PRINT_VERTICAL_GAP  = 20;
AVL.PRINT_HORIZONTAL_GAP = 50;
AVL.EXPLANITORY_TEXT_X = 10;
AVL.EXPLANITORY_TEXT_Y = 10;



AVL.prototype.init = function(am, w, h)
{
	var sc = AVL.superclass;
	var fn = sc.init;
	this.first_print_pos_y  = h - 2 * AVL.PRINT_VERTICAL_GAP;
	this.print_max = w - 10;
	
	fn.call(this, am, w, h);
	this.startingX = w / 2;
	this.addControls();
	this.nextIndex = 1;
	this.commands = [];
	this.cmd("CreateLabel", 0, "", AVL.EXPLANITORY_TEXT_X, AVL.EXPLANITORY_TEXT_Y, 0);
	this.animationManager.StartNewAnimation(this.commands);
	this.animationManager.skipForward();
	this.animationManager.clearHistory();
	
}

// AVL.prototype.addControls =  function()
// {
// 	this.insertField = addControlToAlgorithmBar("Text", "", "insertInput form-control topContorl");
// 	this.insertField.onkeydown = this.returnSubmit(this.insertField,  this.insertCallback.bind(this), 4);
// 	this.insertButton = addControlToAlgorithmBar("Button", "Вставить элемент", "Insert btn btn-primary topContorl");
// 	this.insertButton.onclick = this.insertCallback.bind(this);
// 	this.deleteField = addControlToAlgorithmBar("Text", "", "DeleteInput form-control topContorl");
// 	this.deleteField.onkeydown = this.returnSubmit(this.deleteField,  this.deleteCallback.bind(this), 4);
// 	this.deleteButton = addControlToAlgorithmBar("Button", "Удалить элемент", "Delete btn btn-primary topContorl");
// 	this.deleteButton.onclick = this.deleteCallback.bind(this);
// 	this.findField = addControlToAlgorithmBar("Text", "", "FindInput form-control topContorl");
// 	this.findField.onkeydown = this.returnSubmit(this.findField,  this.findCallback.bind(this), 4);
// 	this.findButton = addControlToAlgorithmBar("Button", "Искать элемент", "Find btn btn-primary topContorl");
// 	this.findButton.onclick = this.findCallback.bind(this);
// 	this.printButton = addControlToAlgorithmBar("Button", "Распечатать дерево", "Print btn btn-primary topContorl");
// 	this.printButton.onclick = this.printCallback.bind(this);
// }

AVL.prototype.addControls =  function()
{
	this.insertField = addControlToAlgorithmBar("Text", "", "insertInput form-control topContorl", "input");
	this.insertField.onkeydown = this.returnSubmit(this.insertField,  this.insertCallback.bind(this), 4);
	this.insertButton = addControlToAlgorithmBar1("Button", "Вставить элемент", "Insert btn btn-primary topContorl", "input");
	this.insertButton.onclick = this.insertCallback.bind(this);
	this.deleteField = addControlToAlgorithmBar("Text", "", "DeleteInput form-control topContorl", "delete");
	this.deleteField.onkeydown = this.returnSubmit(this.deleteField,  this.deleteCallback.bind(this), 4);
	this.deleteButton = addControlToAlgorithmBar1("Button", "Удалить элемент", "Delete btn btn-primary topContorl", "delete");
	this.deleteButton.onclick = this.deleteCallback.bind(this);
	this.findField = addControlToAlgorithmBar("Text", "", "FindInput form-control topContorl", "find");
	this.findField.onkeydown = this.returnSubmit(this.findField,  this.findCallback.bind(this), 4);
	this.findButton = addControlToAlgorithmBar1("Button", "Искать элемент", "Find btn btn-primary topContorl", "find");
	this.findButton.onclick = this.findCallback.bind(this);
	this.printButton = addControlToAlgorithmBar("Button", "Распечатать дерево", "Print btn btn-primary topContorl");
	this.printButton.onclick = this.printCallback.bind(this);
	this.printRandButton = addControlToAlgorithmBar("Button", "Вывести случайное дерево", "PrintRandTree btn btn-primary topContorl test12");
	this.printRandButton.onclick = this.printRandCallback.bind(this)
	this.deleteTreeButton = addControlToAlgorithmBar("Button", "Удалить дерево", "DeleteTree btn btn-primary topContorl");
	this.deleteTreeButton.onclick = this.deleteTreeCallback.bind(this)

}

AVL.prototype.reset = function()
{
	this.nextIndex = 1;
	this.treeRoot = null;
}




AVL.prototype.insertCallback = function(event)
{
	var insertedValue = this.insertField.value;
	// Get text value
	insertedValue = this.normalizeNumber(insertedValue, 4);
	if (insertedValue != "")
	{
		// set text value
		this.insertField.value = "";
		this.implementAction(this.insertElement1.bind(this), insertedValue);
	}
}

AVL.prototype.deleteCallback = function(event)
{
	var deletedValue = this.deleteField.value;
	if (deletedValue != "")
	{
		deletedValue = this.normalizeNumber(deletedValue, 4);
		this.deleteField.value = "";
		this.implementAction(this.deleteElement.bind(this),deletedValue);		
	}
}


AVL.prototype.findCallback = function(event)
{
	var findValue = this.findField.value;
	if (findValue != "")
	{
		findValue = this.normalizeNumber(findValue, 4);
		this.findField.value = "";
		this.implementAction(this.findElement.bind(this),findValue);		
	}
}

AVL.prototype.printCallback = function(event)
{
	this.implementAction(this.printTree.bind(this),"");						
}


AVL.prototype.printRandCallback = function(event)
{
	this.implementAction(this.printRandTree.bind(this),"");						
}

AVL.prototype.deleteTreeCallback = function(event)
{
	this.implementAction(this.deleteTree.bind(this),"");						
}

AVL.prototype.sizeChanged = function(newWidth, newHeight)
{
	this.startingX = newWidth / 2;
}

		 
		
AVL.prototype.printTree = function(unused)
{
	let log = document.getElementById('textblock')
	$('#infocode').css('width', '360px');
	$('#test234').addClass("rotateclass")
	log.innerText = ""
	this.commands = [];
	
	if (this.treeRoot != null)
	{
		this.highlightID = this.nextIndex++;
		var firstLabel = this.nextIndex;
		this.cmd("CreateHighlightCircle", this.highlightID, AVL.HIGHLIGHT_COLOR, this.treeRoot.x, this.treeRoot.y);
		this.xPosOfNextLabel = AVL.FIRST_PRINT_POS_X;
		this.yPosOfNextLabel = this.first_print_pos_y;
		this.printTreeRec(this.treeRoot);
		this.cmd("Delete",this.highlightID);
		this.cmd("Step");
		for (var i = firstLabel; i < this.nextIndex; i++)
			this.cmd("Delete", i);
		this.nextIndex = this.highlightID;  /// Reuse objects.  Not necessary.
	}
	return this.commands;
}


AVL.prototype.printRandTree = function(unused)
{
	let log = document.getElementById('textblock')

	log.innerText = ""

	this.deleteTree()
	let max = 15
	let a = []
	var index = 1
	for (let i = 0; i < max; i++) {
		a.push(Math.floor(Math.random() * 100))
	}
	a.forEach(element => {
		setTimeout(() => {
			this.implementAction(this.insertElement1.bind(this), element);
			this.animationManager.skipForward();

		}, 1000*index);
		index++;
	});

	window.console.log(this)
	
}

AVL.prototype.deleteTree = function(unused)
{
	let log = document.getElementById('textblock')
	$('#infocode').css('width', '360px');
	$('#test234').addClass("rotateclass")
	log.innerText = ""
	this.animationManager.resetAll()

	this.nextIndex = 1;
	this.treeRoot = null;
	this.commands = [];
	this.cmd("CreateLabel", 0, "", AVL.EXPLANITORY_TEXT_X, AVL.EXPLANITORY_TEXT_Y, 0);
	this.animationManager.StartNewAnimation(this.commands);
	this.animationManager.skipForward();
	this.animationManager.clearHistory();
	window.console.log(this)
	log.innerText = "Дерево отчищено\n\n"

}

AVL.prototype.printTreeRec = function(tree) 
{
	let log = document.getElementById('textblock')

	this.cmd("Step");
	if (tree.left != null)
	{
		this.cmd("Move", this.highlightID, tree.left.x, tree.left.y);
		this.printTreeRec(tree.left);
		this.cmd("Move", this.highlightID, tree.x, tree.y);				
		this.cmd("Step");
	}
	var nextLabelID = this.nextIndex++;
	log.innerText += tree.data + '\n'
	this.cmd("CreateLabel", nextLabelID, tree.data, tree.x, tree.y);
	this.cmd("SetForegroundColor", nextLabelID, AVL.PRINT_COLOR);
	this.cmd("Move", nextLabelID, this.xPosOfNextLabel, this.yPosOfNextLabel);
	this.cmd("Step");
	
	this.xPosOfNextLabel +=  AVL.PRINT_HORIZONTAL_GAP;
	if (this.xPosOfNextLabel > this.print_max)
	{
		this.xPosOfNextLabel = AVL.FIRST_PRINT_POS_X;
		this.yPosOfNextLabel += AVL.PRINT_VERTICAL_GAP;
		
	}
	if (tree.right != null)
	{
		this.cmd("Move", this.highlightID, tree.right.x, tree.right.y);
		this.printTreeRec(tree.right);
		this.cmd("Move", this.highlightID, tree.x, tree.y);	
		this.cmd("Step");
	}
	return;
}


AVL.prototype.findElement = function(findValue)
{
	let log = document.getElementById('textblock')
	$('#infocode').css('width', '360px');
	$('#test234').addClass("rotateclass")
	log.innerText = ""

	this.commands = [];
	log.innerText = "Ищем " + findValue + '\n\n'
	this.highlightID = this.nextIndex++;
	
	this.doFind(this.treeRoot, findValue);
	
	
	return this.commands;
}


AVL.prototype.doFind = function(tree, value)
{
	let log = document.getElementById('textblock')

	this.cmd("SetText", 0, "Searchiing for "+value);
	if (tree != null)
	{
		this.cmd("SetHighlight", tree.graphicID, 1);
		if (tree.data == value)
		{
			this.cmd("SetText", 0, "Searching for "+value+" : " + value + " = " + value + " (Element found!)");
			log.innerText += "Искомое значение " +  value +  " == " + tree.data + '\n Элемент найден'
			this.cmd("Step");
			this.cmd("SetText", 0, "Found:"+value);
			this.cmd("SetHighlight", tree.graphicID, 0);
		}
		else
		{
			if (tree.data > value)
			{
				this.cmd("SetText", 0, "Searching for "+value+" : " + value + " < " + tree.data + " (look to left subtree)");
				log.innerText += value + " < " + tree.data + "\n Идем в лево" + '\n\n'

				this.cmd("Step");
				this.cmd("SetHighlight", tree.graphicID, 0);
				if (tree.left!= null)
				{
					this.cmd("CreateHighlightCircle", this.highlightID, AVL.HIGHLIGHT_COLOR, tree.x, tree.y);
					this.cmd("Move", this.highlightID, tree.left.x, tree.left.y);
					this.cmd("Step");
					this.cmd("Delete", this.highlightID);
				}
				this.doFind(tree.left, value);
			}
			else
			{
				this.cmd("SetText", 0, " Searching for "+value+" : " + value + " > " + tree.data + " (look to right subtree)");
				log.innerText += value + " > " + tree.data + "\n Идем в право" + '\n\n'
					
				this.cmd("Step");
				this.cmd("SetHighlight", tree.graphicID, 0);
				if (tree.right!= null)
				{
					this.cmd("CreateHighlightCircle", this.highlightID, AVL.HIGHLIGHT_COLOR, tree.x, tree.y);
					this.cmd("Move", this.highlightID, tree.right.x, tree.right.y);
					this.cmd("Step");
					this.cmd("Delete", this.highlightID);				
				}
				this.doFind(tree.right, value);						
			}
			
		}
		
	}
	else
	{
		this.cmd("SetText", 0, " Searching for "+value+" : " + "< Empty Tree > (Element not found)");				
		this.cmd("Step");					
		this.cmd("SetText", 0, " Searching for "+value+" : " + " (Element not found)");	
		log.innerText += "Элемент не найден"

	}
}

AVL.prototype.insertElement = function(insertedValue)
{
	let statusblock = document.getElementById("status")
	let infoblock = document.getElementById("infocode")
	statusblock.innerText = "";
	infoblock.innerHTML = "";
	infoblock.innerHTML = "<p class='infoHeader ifRoot'>Если корень не задан</p>";
	infoblock.innerHTML += "<p class='infoSubHeader enterRoot'>&nbsp;&nbsp;Задаем корень</p>"
	infoblock.innerHTML += "<p class='infoHeader ifLeft'>Если вставляемое значение < ключа</p>"
	infoblock.innerHTML += "<p class='infoSubHeader goLeft'>&nbsp;&nbsp;Идем в лево</p>"
	infoblock.innerHTML += "<p class='infoSubSubHeader ifEmptyKey'>&nbsp;&nbsp;&nbsp;&nbsp;Если нет ключа</p>"
	infoblock.innerHTML += "<p class='infoSubSubSubHeader insertKey'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Вставляем элемент</p>"
	infoblock.innerHTML += "<p class='infoSubSubSubHeader ifBalanceKey1'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Если дерево не сбалансировано</p>"
	infoblock.innerHTML += "<p class='infoSubSubSubHeader BalanceKey1'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Балансируем дерево</p>"

	infoblock.innerHTML += "<p class='infoHeader elseRight'>Иначе вправо</p>"
	infoblock.innerHTML += "<p class='infoSubHeader ifEmptyKey'>&nbsp;&nbsp;Если нет ключа</p>"
	infoblock.innerHTML += "<p class='infoSubSubHeader insertKey'>&nbsp;&nbsp;&nbsp;&nbsp;Вставляем элемент</p>"
	infoblock.innerHTML += "<p class='infoSubSubSubHeader ifBalanceKey2'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Если дерево не сбалансировано</p>"
	infoblock.innerHTML += "<p class='infoSubSubSubHeader BalanceKey2'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Балансируем дерево</p>"
	statusblock.style = "visibility: visible"
	infoblock.style = "visibility: visible"
	document.getElementById("test233").classList.add("rotateclass")
	document.getElementById("test234").classList.add("rotateclass")
	this.commands = new Array();  
	let ifRoot = document.getElementsByClassName("ifRoot")[0];
	ifRoot.classList.add('selectedrow')
	statusblock.innerText = "Вставляем " + insertedValue
  
	let enterRoot = document.getElementsByClassName("enterRoot")[0];

	this.commands = [];	
	this.cmd("SetText", 0, " Inserting "+insertedValue);
	new Promise(function(resolve, reject) {
    setTimeout(resolve, 1500);
    // doPlayPause();
    window.console.log('tyt1')
  }).then(()=>{
	ifRoot.classList.remove('selectedrow')
    enterRoot.classList.add('selectedrow')
  }).then(()=>{

	if (this.treeRoot == null)
	{
		var treeNodeID = this.nextIndex++;
		var labelID  = this.nextIndex++;
		this.cmd("CreateCircle", treeNodeID, insertedValue,  this.startingX, AVL.STARTING_Y);
		this.AnimationSteps = this.commands
      	this.animationManager.StartNewAnimation(this.commands)
		this.clearCmd()
		this.cmd("SetForegroundColor", treeNodeID, AVL.FOREGROUND_COLOR);
		this.AnimationSteps = this.commands
      	this.animationManager.StartNewAnimation(this.commands)
		this.cmd("SetBackgroundColor", treeNodeID, AVL.BACKGROUND_COLOR);
		this.AnimationSteps = this.commands
      	this.animationManager.StartNewAnimation(this.commands)
		this.cmd("CreateLabel", labelID, 1,  this.startingX - 20, AVL.STARTING_Y-20);
		this.AnimationSteps = this.commands
      	this.animationManager.StartNewAnimation(this.commands)
		this.clearCmd()

		this.cmd("SetForegroundColor", labelID, AVL.HEIGHT_LABEL_COLOR);
		this.AnimationSteps = this.commands
      	this.animationManager.StartNewAnimation(this.commands)
		this.cmd("Step");	
		this.AnimationSteps = this.commands
      	this.animationManager.StartNewAnimation(this.commands)			
		this.treeRoot = new AVLNode(insertedValue, treeNodeID, labelID, this.startingX, AVL.STARTING_Y);
		this.treeRoot.height = 1;
	}
	else
	{
		let ifRoot = document.getElementsByClassName("ifRoot")[0];
		ifRoot.classList.remove('selectedrow')
		let enterRoot = document.getElementsByClassName("enterRoot")[0];
		enterRoot.classList.remove('selectedrow')
		let ifLeft = document.getElementsByClassName("ifLeft")[0];
		ifLeft.classList.add('selectedrow')
		new Promise(function(resolve, reject) {
			setTimeout(resolve, 1500);
			window.console.log('tyt1')
		  }).then(()=>{
			treeNodeID = this.nextIndex++;
			labelID = this.nextIndex++;
			this.highlightID = this.nextIndex++;
			
			this.cmd("CreateCircle", treeNodeID, insertedValue, 30, AVL.STARTING_Y);
			this.AnimationSteps = this.commands
			this.animationManager.StartNewAnimation(this.commands)
		  	this.clearCmd()
			this.cmd("SetForegroundColor", treeNodeID, AVL.FOREGROUND_COLOR);
			this.AnimationSteps = this.commands
			this.animationManager.StartNewAnimation(this.commands)
			this.cmd("SetBackgroundColor", treeNodeID, AVL.BACKGROUND_COLOR);
			this.AnimationSteps = this.commands
			this.animationManager.StartNewAnimation(this.commands)
			this.cmd("CreateLabel", labelID, "",  100-20, 100-20);
			this.AnimationSteps = this.commands
			this.animationManager.StartNewAnimation(this.commands)
		  	this.clearCmd()
			this.cmd("SetForegroundColor", labelID, AVL.HEIGHT_LABEL_COLOR);
			this.AnimationSteps = this.commands
			this.animationManager.StartNewAnimation(this.commands)
			this.cmd("Step");		
			this.AnimationSteps = this.commands
			this.animationManager.StartNewAnimation(this.commands)		
			var insertElem = new AVLNode(insertedValue, treeNodeID, labelID, 100, 100)
			
			this.cmd("SetHighlight", insertElem.graphicID, 1);
			this.AnimationSteps = this.commands
			this.animationManager.StartNewAnimation(this.commands)
			insertElem.height = 1;
			new Promise(function(resolve, reject) {
				setTimeout(resolve, 10);
				// doPlayPause();
				window.console.log('tyt1')
			  }).then(()=>{
				// this.clearCmd()
				this.insert(insertElem, this.treeRoot);

			  })
		  })
		
		//				this.resizeTree();				
	}
	this.cmd("SetText", 0, " ");				
	return this.commands;
	})
}


AVL.prototype.singleRotateRight = function(tree)
{
	var B = tree;
	var t3 = B.right;
	var A = tree.left;
	var t1 = A.left;
	var t2 = A.right;
	
	this.cmd("SetText", 0, "Single Rotate Right");
	// alert("Выполняем простой поворот вправо")
	this.cmd("SetEdgeHighlight", B.graphicID, A.graphicID, 1);
	this.cmd("Step");
	
	
	if (t2 != null)
	{
		this.cmd("Disconnect", A.graphicID, t2.graphicID);																		  
		this.cmd("Connect", B.graphicID, t2.graphicID, AVL.LINK_COLOR);
		t2.parent = B;
	}
	this.cmd("Disconnect", B.graphicID, A.graphicID);
	this.cmd("Connect", A.graphicID, B.graphicID, AVL.LINK_COLOR);
	A.parent = B.parent;
	if (this.treeRoot == B)
	{
		this.treeRoot = A;
	}
	else
	{
		this.cmd("Disconnect", B.parent.graphicID, B.graphicID, AVL.LINK_COLOR);
		this.cmd("Connect", B.parent.graphicID, A.graphicID, AVL.LINK_COLOR)
		if (B.isLeftChild())
		{
			B.parent.left = A;
		}
		else
		{
			B.parent.right = A;
		}
	}
	A.right = B;
	B.parent = A;
	B.left = t2;
	this. resetHeight(B);
	this. resetHeight(A);
	this.resizeTree();			
}



AVL.prototype.singleRotateLeft = function(tree)
{
	var A = tree;
	var B = tree.right;
	var t1 = A.left;
	var t2 = B.left;
	var t3 = B.right;
	
	this.cmd("SetText", 0, "Single Rotate Left");
	// alert("Выполняем простой поворот в лево")
	this.cmd("SetEdgeHighlight", A.graphicID, B.graphicID, 1);
	this.cmd("Step");
	
	if (t2 != null)
	{
		this.cmd("Disconnect", B.graphicID, t2.graphicID);																		  
		this.cmd("Connect", A.graphicID, t2.graphicID, AVL.LINK_COLOR);
		t2.parent = A;
	}
	this.cmd("Disconnect", A.graphicID, B.graphicID);
	this.cmd("Connect", B.graphicID, A.graphicID, AVL.LINK_COLOR);
	B.parent = A.parent;
	if (this.treeRoot == A)
	{
		this.treeRoot = B;
	}
	else
	{
		this.cmd("Disconnect", A.parent.graphicID, A.graphicID, AVL.LINK_COLOR);
		this.cmd("Connect", A.parent.graphicID, B.graphicID, AVL.LINK_COLOR)
		
		if (A.isLeftChild())
		{
			A.parent.left = B;
		}
		else
		{
			A.parent.right = B;
		}
	}
	B.left = A;
	A.parent = B;
	A.right = t2;
	this. resetHeight(A);
	this. resetHeight(B);
	
	this.resizeTree();			
}




AVL.prototype.getHeight = function(tree) 
{
	if (tree == null)
	{
		return 0;
	}
	return tree.height;
}

AVL.prototype.resetHeight = function(tree)
{
	if (tree != null)
	{
		var newHeight = Math.max(this.getHeight(tree.left), this.getHeight(tree.right)) + 1;
		if (tree.height != newHeight)
		{
			tree.height = Math.max(this.getHeight(tree.left), this.getHeight(tree.right)) + 1
			this.cmd("SetText",tree.heightLabelID, newHeight);
//			this.cmd("SetText",tree.heightLabelID, newHeight);
		}
	}
}

AVL.prototype.doubleRotateRight = function(tree)
{
	this.cmd("SetText", 0, "Double Rotate Right");
	// alert("Выполняем большой поворот вправо")
	var A = tree.left;
	var B = tree.left.right;
	var C = tree;
	var t1 = A.left;
	var t2 = B.left;
	var t3 = B.right;
	var t4 = C.right;
	
	this.cmd("Disconnect", C.graphicID, A.graphicID);
	this.cmd("Disconnect", A.graphicID, B.graphicID);
	this.cmd("Connect", C.graphicID, A.graphicID, AVL.HIGHLIGHT_LINK_COLOR);
	this.cmd("Connect", A.graphicID, B.graphicID, AVL.HIGHLIGHT_LINK_COLOR);
	this.cmd("Step");
	
	if (t2 != null)
	{
		this.cmd("Disconnect",B.graphicID, t2.graphicID);
		t2.parent = A;
		A.right = t2;
		this.cmd("Connect", A.graphicID, t2.graphicID, AVL.LINK_COLOR);
	}
	if (t3 != null)
	{
		this.cmd("Disconnect",B.graphicID, t3.graphicID);
		t3.parent = C;
		C.left = t2;
		this.cmd("Connect", C.graphicID, t3.graphicID, AVL.LINK_COLOR);
	}
	if (C.parent == null)
	{
		B.parent = null;
		this.treeRoot = B;
	}
	else
	{
		this.cmd("Disconnect",C.parent.graphicID, C.graphicID);
		this.cmd("Connect",C.parent.graphicID, B.graphicID, AVL.LINK_COLOR);
		if (C.isLeftChild())
		{
			C.parent.left = B
		}
		else
		{
			C.parent.right = B;
		}
		B.parent = C.parent;
		C.parent = B;
	}
	this.cmd("Disconnect", C.graphicID, A.graphicID);
	this.cmd("Disconnect", A.graphicID, B.graphicID);
	this.cmd("Connect", B.graphicID, A.graphicID, AVL.LINK_COLOR);
	this.cmd("Connect", B.graphicID, C.graphicID, AVL.LINK_COLOR);
	B.left = A;
	A.parent = B;
	B.right=C;
	C.parent=B;
	A.right=t2;
	C.left = t3;
	this. resetHeight(A);
	this. resetHeight(C);
	this. resetHeight(B);
	
	this.resizeTree();
	
	
}

AVL.prototype.doubleRotateLeft = function(tree)
{
	this.cmd("SetText", 0, "Double Rotate Left");
	// alert("Выполняем большой поворот влево")
	var A = tree;
	var B = tree.right.left;
	var C = tree.right;
	var t1 = A.left;
	var t2 = B.left;
	var t3 = B.right;
	var t4 = C.right;
	
	this.cmd("Disconnect", A.graphicID, C.graphicID);
	this.cmd("Disconnect", C.graphicID, B.graphicID);
	this.cmd("Connect", A.graphicID, C.graphicID, AVL.HIGHLIGHT_LINK_COLOR);
	this.cmd("Connect", C.graphicID, B.graphicID, AVL.HIGHLIGHT_LINK_COLOR);
	this.cmd("Step");
	
	if (t2 != null)
	{
		this.cmd("Disconnect",B.graphicID, t2.graphicID);
		t2.parent = A;
		A.right = t2;
		this.cmd("Connect", A.graphicID, t2.graphicID, AVL.LINK_COLOR);
	}
	if (t3 != null)
	{
		this.cmd("Disconnect",B.graphicID, t3.graphicID);
		t3.parent = C;
		C.left = t2;
		this.cmd("Connect", C.graphicID, t3.graphicID, AVL.LINK_COLOR);
	}
		
	
	if (A.parent == null)
	{
		B.parent = null;
		this.treeRoot = B;
	}
	else
	{
		this.cmd("Disconnect",A.parent.graphicID, A.graphicID);
		this.cmd("Connect",A.parent.graphicID, B.graphicID, AVL.LINK_COLOR);
		if (A.isLeftChild())
		{
			A.parent.left = B
		}
		else
		{
			A.parent.right = B;
		}
		B.parent = A.parent;
		A.parent = B;
	}
	this.cmd("Disconnect", A.graphicID, C.graphicID);
	this.cmd("Disconnect", C.graphicID, B.graphicID);
	this.cmd("Connect", B.graphicID, A.graphicID, AVL.LINK_COLOR);
	this.cmd("Connect", B.graphicID, C.graphicID, AVL.LINK_COLOR);
	B.left = A;
	A.parent = B;
	B.right=C;
	C.parent=B;
	A.right=t2;
	C.left = t3;
	this. resetHeight(A);
	this. resetHeight(C);
	this. resetHeight(B);
	
	this.resizeTree();
	
	
}

AVL.prototype.insert = async function(elem, tree)
{
	this.clearCmd()

	let statusblock = document.getElementById("status")
	statusblock.innerText = "";
	statusblock.innerText = "Вставляем " + elem.data

	let ifLeft = document.getElementsByClassName("ifLeft")[0];
	let goLeft = document.getElementsByClassName("goLeft")[0];
	let ifEmptyKey = document.getElementsByClassName("ifEmptyKey")[0];
	let insertKey = document.getElementsByClassName("insertKey")[0];
	let elseRight = document.getElementsByClassName("elseRight")[0];
	let ifEmptyKey2 = document.getElementsByClassName("ifEmptyKey")[1];
	let insertKey2 = document.getElementsByClassName("insertKey")[1];
	let ifBalanceKey1 = document.getElementsByClassName("ifBalanceKey1")[0];
	let ifBalanceKey2 = document.getElementsByClassName("ifBalanceKey2")[0]
	let BalanceKey2 = document.getElementsByClassName("BalanceKey2")[0]
	let BalanceKey1 = document.getElementsByClassName("BalanceKey1")[0]

	ifLeft.classList.add('selectedrow')
	ifBalanceKey1.classList.remove('selectedrow')
	BalanceKey1.classList.remove('selectedrow')
	ifBalanceKey2.classList.remove('selectedrow')
	BalanceKey2.classList.remove('selectedrow')
	ifEmptyKey.classList.remove('selectedrow')
	ifEmptyKey2.classList.remove('selectedrow')
	this.cmd("SetHighlight", tree.graphicID, 1);
	this.AnimationSteps = this.commands
    this.animationManager.StartNewAnimation(this.commands)
	this.cmd("SetHighlight", elem.graphicID, 1);
	this.AnimationSteps = this.commands
    this.animationManager.StartNewAnimation(this.commands)
	
	if (elem.data < tree.data)
	{
		new Promise(function(resolve, reject) {
			setTimeout(resolve, 1);
			// doPlayPause();
			window.console.log('tyt1')
		  }).then(()=>{
			ifLeft.classList.remove('selectedrow')
			goLeft.classList.add('selectedrow')
		  })	}
	else
	{
		 new Promise(function(resolve, reject) {
			setTimeout(resolve, 1);
			// doPlayPause();
			window.console.log('tyt1')
		  }).then(()=>{
			ifLeft.classList.remove('selectedrow')
			elseRight.classList.add('selectedrow')
		  })	}
	this.cmd("Step");
	this.AnimationSteps = this.commands
    this.animationManager.StartNewAnimation(this.commands)
	this.cmd("SetHighlight", tree.graphicID , 0);
	this.AnimationSteps = this.commands
    this.animationManager.StartNewAnimation(this.commands)
	this.cmd("SetHighlight", elem.graphicID, 0);
	this.AnimationSteps = this.commands
    this.animationManager.StartNewAnimation(this.commands)
	
	if (elem.data < tree.data)
	{
		await new Promise(function(resolve, reject) {
			setTimeout(resolve, 1500);
			// doPlayPause();
			window.console.log('tyt1')
		  }).then(()=>{
			goLeft.classList.remove('selectedrow')
			ifEmptyKey.classList.add("selectedrow")
		  })
		if (tree.left == null)
		{
			
			await new Promise(function(resolve, reject) {
				setTimeout(resolve, 1500);
				// doPlayPause();
				window.console.log('tyt25550')
			  }).then(()=>{
				ifEmptyKey.classList.remove("selectedrow")
				insertKey.classList.add("selectedrow")
				this.cmd("SetHighlight", elem.graphicID, 0);
				this.AnimationSteps = this.commands
    			this.animationManager.StartNewAnimation(this.commands)
				tree.left=elem;
				elem.parent = tree;
				this.cmd("Connect", tree.graphicID, elem.graphicID, AVL.LINK_COLOR);
				this.AnimationSteps = this.commands
    			this.animationManager.StartNewAnimation(this.commands)
				
				this.resizeTree();

				this.cmd("CreateHighlightCircle", this.highlightID, AVL.HIGHLIGHT_COLOR, tree.left.x, tree.left.y);
				this.AnimationSteps = this.commands
    			this.animationManager.StartNewAnimation(this.commands)
				this.cmd("Move", this.highlightID, tree.x, tree.y);
				this.AnimationSteps = this.commands
    			this.animationManager.StartNewAnimation(this.commands)
				// this.cmd("SetText",  0, "Unwinding Recursion");			
				this.cmd("Step");
				this.AnimationSteps = this.commands
    			this.animationManager.StartNewAnimation(this.commands)
				this.cmd("Delete", this.highlightID);
				this.AnimationSteps = this.commands
    			this.animationManager.StartNewAnimation(this.commands)
			
			if (tree.height < tree.left.height + 1)
			{
				tree.height = tree.left.height + 1

		
				this.cmd("SetForegroundColor", tree.heightLabelID, AVL.HIGHLIGHT_LABEL_COLOR);
				this.AnimationSteps = this.commands
    		this.animationManager.StartNewAnimation(this.commands)
				this.cmd("Step");
				this.AnimationSteps = this.commands
    		this.animationManager.StartNewAnimation(this.commands)
				this.cmd("SetForegroundColor", tree.heightLabelID, AVL.HEIGHT_LABEL_COLOR);	
				this.AnimationSteps = this.commands
    		this.animationManager.StartNewAnimation(this.commands)					
			}
			this.clearCmd()

		})
		}
		else
		{
			new Promise(function(resolve, reject) {
				setTimeout(resolve, 1500);
				// doPlayPause();
				window.console.log('tyt1')
			  }).then(async()=>{

			ifEmptyKey.classList.remove("selectedrow")
			ifLeft.classList.add('selectedrow')
			this.cmd("CreateHighlightCircle", this.highlightID, AVL.HIGHLIGHT_COLOR, tree.x, tree.y);
			this.AnimationSteps = this.commands
    		this.animationManager.StartNewAnimation(this.commands)

			this.cmd("Move", this.highlightID, tree.left.x, tree.left.y);
			this.AnimationSteps = this.commands
    		this.animationManager.StartNewAnimation(this.commands)
			this.cmd("Step");
			this.AnimationSteps = this.commands
    		this.animationManager.StartNewAnimation(this.commands)
			this.cmd("Delete", this.highlightID);
			this.AnimationSteps = this.commands
    		this.animationManager.StartNewAnimation(this.commands)
			this.insert(elem, tree.left);
			this.cmd("CreateHighlightCircle", this.highlightID, AVL.HIGHLIGHT_COLOR, tree.left.x, tree.left.y);
			this.AnimationSteps = this.commands
    		this.animationManager.StartNewAnimation(this.commands)
			this.cmd("Move", this.highlightID, tree.x, tree.y);
			this.AnimationSteps = this.commands
    		this.animationManager.StartNewAnimation(this.commands)
			this.cmd("SetText",  0,"Unwinding Recursion");	
			this.AnimationSteps = this.commands
    		this.animationManager.StartNewAnimation(this.commands)		
			this.cmd("Step");
			this.AnimationSteps = this.commands
    		this.animationManager.StartNewAnimation(this.commands)
			this.cmd("Delete", this.highlightID);
			this.AnimationSteps = this.commands
    		this.animationManager.StartNewAnimation(this.commands)
			
			if (tree.height < tree.left.height + 1)
			{
				tree.height = tree.left.height + 1
				this.cmd("SetText",tree.heightLabelID,tree.height); 
				this.cmd("SetText",  0, "Adjusting height after recursive call");	
				this.cmd("SetForegroundColor", tree.heightLabelID, AVL.HIGHLIGHT_LABEL_COLOR);
				this.AnimationSteps = this.commands
    		this.animationManager.StartNewAnimation(this.commands)
				this.cmd("Step");
				this.AnimationSteps = this.commands
    		this.animationManager.StartNewAnimation(this.commands)
				this.cmd("SetForegroundColor", tree.heightLabelID, AVL.HEIGHT_LABEL_COLOR);
				this.AnimationSteps = this.commands
    		this.animationManager.StartNewAnimation(this.commands)
				
			}
			

			await new Promise(function(resolve, reject) {
				setTimeout(resolve, 1500);
				ifEmptyKey.classList.remove("selectedrow")
				ifBalanceKey1.classList.add("selectedrow")
				window.console.log(ifBalanceKey1)
				window.console.log('tyt1')
			  }).then(async()=>{
				
			if ((tree.right != null && tree.left.height > tree.right.height + 1) ||
				(tree.right == null && tree.left.height > 1))
			{
				await new Promise(function(resolve, reject) {
					setTimeout(resolve, 1500);
					BalanceKey1.classList.add("selectedrow")
					ifBalanceKey1.classList.remove("selectedrow")
					window.console.log('tyt1')
				  }).then(()=>{
				if (elem.data < tree.left.data)
				{
					this.singleRotateRight(tree);
				}
				else
				{
					this.doubleRotateRight(tree);
				}
				ifBalanceKey1.classList.remove("selectedrow")
				BalanceKey1.classList.remove("selectedrow")
				ifLeft.classList.add("selectedrow")

			})
			}
			ifBalanceKey1.classList.remove("selectedrow")
				ifLeft.classList.add("selectedrow")
			
		})
			

		})
		}
		
	}
	else
	{
		await new Promise(function(resolve, reject) {
			setTimeout(resolve, 1500);
			// doPlayPause();
			window.console.log('tyt1')
		  }).then(()=>{
			elseRight.classList.remove('selectedrow')
			ifEmptyKey2.classList.add("selectedrow")
		  })
		if (tree.right == null)
		{
			await new Promise(function(resolve, reject) {
				setTimeout(resolve, 1500);
				// doPlayPause();
				window.console.log('tyt1')
			  }).then(()=>{
				ifEmptyKey2.classList.remove("selectedrow")
				insertKey2.classList.add("selectedrow")
			  
			this.cmd("SetText",  0, "Found null tree, inserting element");			
			this.cmd("SetText", elem.heightLabelID,1); 
			this.cmd("SetHighlight", elem.graphicID, 0);
			this.AnimationSteps = this.commands
    		this.animationManager.StartNewAnimation(this.commands)	
			tree.right=elem;
			elem.parent = tree;
			this.cmd("Connect", tree.graphicID, elem.graphicID, AVL.LINK_COLOR);
			this.AnimationSteps = this.commands
    		this.animationManager.StartNewAnimation(this.commands)	
			elem.x = tree.x + AVL.WIDTH_DELTA/2;
			elem.y = tree.y + AVL.HEIGHT_DELTA
			this.cmd("Move", elem.graphicID, elem.x, elem.y);
			this.AnimationSteps = this.commands
    		this.animationManager.StartNewAnimation(this.commands)	
			
			this.resizeTree();
			
			
			this.cmd("CreateHighlightCircle", this.highlightID, AVL.HIGHLIGHT_COLOR, tree.right.x, tree.right.y);
			this.AnimationSteps = this.commands
    		this.animationManager.StartNewAnimation(this.commands)	
			this.cmd("Move", this.highlightID, tree.x, tree.y);
			this.AnimationSteps = this.commands
    		this.animationManager.StartNewAnimation(this.commands)	
			this.cmd("SetText",  0, "Unwinding Recursion");			
			this.cmd("Step");
			this.AnimationSteps = this.commands
    		this.animationManager.StartNewAnimation(this.commands)	
			this.cmd("Delete", this.highlightID);
			this.AnimationSteps = this.commands
    		this.animationManager.StartNewAnimation(this.commands)	
			
			if (tree.height < tree.right.height + 1)
			{
				tree.height = tree.right.height + 1
				this.cmd("SetText",tree.heightLabelID,tree.height); 
				this.cmd("SetText",   0, "Adjusting height after recursive call");	
		
				this.cmd("SetForegroundColor", tree.heightLabelID, AVL.HIGHLIGHT_LABEL_COLOR);
				this.AnimationSteps = this.commands
    		this.animationManager.StartNewAnimation(this.commands)	
				this.cmd("Step");
				this.AnimationSteps = this.commands
    		this.animationManager.StartNewAnimation(this.commands)	
				this.cmd("SetForegroundColor", tree.heightLabelID, AVL.HEIGHT_LABEL_COLOR);	
				this.AnimationSteps = this.commands
    		this.animationManager.StartNewAnimation(this.commands)						
			}
		})
		}
		else
		{
			this.cmd("CreateHighlightCircle", this.highlightID, AVL.HIGHLIGHT_COLOR, tree.x, tree.y);
			this.cmd("Move", this.highlightID, tree.right.x, tree.right.y);
			this.cmd("Step");
			this.cmd("Delete", this.highlightID);
			this.insert(elem, tree.right);
			this.cmd("CreateHighlightCircle", this.highlightID, AVL.HIGHLIGHT_COLOR, tree.right.x, tree.right.y);
			this.cmd("Move", this.highlightID, tree.x, tree.y);
			this.cmd("SetText",  0, "Unwinding Recursion");			
			this.cmd("Step");
			this.cmd("Delete", this.highlightID);
			if (tree.height < tree.right.height + 1)
			{
				tree.height = tree.right.height + 1
				this.cmd("SetText",tree.heightLabelID,tree.height); 
				this.cmd("SetText",  0, "Adjusting height after recursive call");			
				this.cmd("SetForegroundColor", tree.heightLabelID, AVL.HIGHLIGHT_LABEL_COLOR);
				this.cmd("Step");
				this.cmd("SetForegroundColor", tree.heightLabelID, AVL.HEIGHT_LABEL_COLOR);
				
				
			}
			if ((tree.left != null && tree.right.height > tree.left.height + 1) ||
				(tree.left == null && tree.right.height > 1))
			{
				if (elem.data >= tree.right.data)
				{
					this.singleRotateLeft(tree);
				}
				else
				{
					this.doubleRotateLeft(tree);
				}
			}
		}
	}
	
	
}

/*******************************************************************************/

AVL.prototype.insertElement1 = function(insertedValue)
{
	let log = document.getElementById('textblock')
	$('#infocode').css('width', '360px');
	$('#test234').addClass("rotateclass")
	this.commands = [];	
	this.cmd("SetText", 0, " Inserting "+insertedValue);
	log.innerText += "Вставляем " + insertedValue + '\n'
	
	if (this.treeRoot == null)
	{
		log.innerText += "Корень пустой. Задаем корень = " + insertedValue + '\n\n'

		var treeNodeID = this.nextIndex++;
		var labelID  = this.nextIndex++;
		this.cmd("CreateCircle", treeNodeID, insertedValue,  this.startingX, AVL.STARTING_Y);
		this.cmd("SetForegroundColor", treeNodeID, AVL.FOREGROUND_COLOR);
		this.cmd("SetBackgroundColor", treeNodeID, AVL.BACKGROUND_COLOR);
		this.cmd("CreateLabel", labelID, 1,  this.startingX - 20, AVL.STARTING_Y-20);
		this.cmd("SetForegroundColor", labelID, AVL.HEIGHT_LABEL_COLOR);
		this.cmd("Step");				
		this.treeRoot = new AVLNode(insertedValue, treeNodeID, labelID, this.startingX, AVL.STARTING_Y);
		this.treeRoot.height = 1;
	}
	else
	{
		treeNodeID = this.nextIndex++;
		labelID = this.nextIndex++;
		this.highlightID = this.nextIndex++;
		
		this.cmd("CreateCircle", treeNodeID, insertedValue, 30, AVL.STARTING_Y);

		this.cmd("SetForegroundColor", treeNodeID, AVL.FOREGROUND_COLOR);
		this.cmd("SetBackgroundColor", treeNodeID, AVL.BACKGROUND_COLOR);
		this.cmd("CreateLabel", labelID, "",  100-20, 100-20);
		this.cmd("SetForegroundColor", labelID, AVL.HEIGHT_LABEL_COLOR);
		this.cmd("Step");				
		var insertElem = new AVLNode(insertedValue, treeNodeID, labelID, 100, 100)
		
		this.cmd("SetHighlight", insertElem.graphicID, 1);
		insertElem.height = 1;
		this.insert1(insertElem, this.treeRoot);
		//				this.resizeTree();				
	}
	this.cmd("SetText", 0, " ");				
	return this.commands;
}


AVL.prototype.singleRotateRight1 = function(tree)
{
	var B = tree;
	var t3 = B.right;
	var A = tree.left;
	var t1 = A.left;
	var t2 = A.right;
	
	this.cmd("SetText", 0, "Single Rotate Right");
	// alert("Выполняем простой поворот вправо")
	this.cmd("SetEdgeHighlight", B.graphicID, A.graphicID, 1);
	this.cmd("Step");
	
	
	if (t2 != null)
	{
		this.cmd("Disconnect", A.graphicID, t2.graphicID);																		  
		this.cmd("Connect", B.graphicID, t2.graphicID, AVL.LINK_COLOR);
		t2.parent = B;
	}
	this.cmd("Disconnect", B.graphicID, A.graphicID);
	this.cmd("Connect", A.graphicID, B.graphicID, AVL.LINK_COLOR);
	A.parent = B.parent;
	if (this.treeRoot == B)
	{
		this.treeRoot = A;
	}
	else
	{
		this.cmd("Disconnect", B.parent.graphicID, B.graphicID, AVL.LINK_COLOR);
		this.cmd("Connect", B.parent.graphicID, A.graphicID, AVL.LINK_COLOR)
		if (B.isLeftChild())
		{
			B.parent.left = A;
		}
		else
		{
			B.parent.right = A;
		}
	}
	A.right = B;
	B.parent = A;
	B.left = t2;
	this. resetHeight1(B);
	this. resetHeight1(A);
	this.resizeTree();			
}



AVL.prototype.singleRotateLeft1 = function(tree)
{
	var A = tree;
	var B = tree.right;
	var t1 = A.left;
	var t2 = B.left;
	var t3 = B.right;
	
	this.cmd("SetText", 0, "Single Rotate Left");
	// alert("Выполняем простой поворот в лево")
	this.cmd("SetEdgeHighlight", A.graphicID, B.graphicID, 1);
	this.cmd("Step");
	
	if (t2 != null)
	{
		this.cmd("Disconnect", B.graphicID, t2.graphicID);																		  
		this.cmd("Connect", A.graphicID, t2.graphicID, AVL.LINK_COLOR);
		t2.parent = A;
	}
	this.cmd("Disconnect", A.graphicID, B.graphicID);
	this.cmd("Connect", B.graphicID, A.graphicID, AVL.LINK_COLOR);
	B.parent = A.parent;
	if (this.treeRoot == A)
	{
		this.treeRoot = B;
	}
	else
	{
		this.cmd("Disconnect", A.parent.graphicID, A.graphicID, AVL.LINK_COLOR);
		this.cmd("Connect", A.parent.graphicID, B.graphicID, AVL.LINK_COLOR)
		
		if (A.isLeftChild())
		{
			A.parent.left = B;
		}
		else
		{
			A.parent.right = B;
		}
	}
	B.left = A;
	A.parent = B;
	A.right = t2;
	this. resetHeight1(A);
	this. resetHeight1(B);
	
	this.resizeTree();			
}




AVL.prototype.getHeight1 = function(tree) 
{
	if (tree == null)
	{
		return 0;
	}
	return tree.height;
}

AVL.prototype.resetHeight1 = function(tree)
{
	if (tree != null)
	{
		var newHeight = Math.max(this.getHeight1(tree.left), this.getHeight1(tree.right)) + 1;
		if (tree.height != newHeight)
		{
			tree.height = Math.max(this.getHeight1(tree.left), this.getHeight1(tree.right)) + 1
			this.cmd("SetText",tree.heightLabelID, newHeight);
//			this.cmd("SetText",tree.heightLabelID, newHeight);
		}
	}
}

AVL.prototype.doubleRotateRight1 = function(tree)
{
	this.cmd("SetText", 0, "Double Rotate Right");
	// alert("Выполняем большой поворот вправо")
	var A = tree.left;
	var B = tree.left.right;
	var C = tree;
	var t1 = A.left;
	var t2 = B.left;
	var t3 = B.right;
	var t4 = C.right;
	
	this.cmd("Disconnect", C.graphicID, A.graphicID);
	this.cmd("Disconnect", A.graphicID, B.graphicID);
	this.cmd("Connect", C.graphicID, A.graphicID, AVL.HIGHLIGHT_LINK_COLOR);
	this.cmd("Connect", A.graphicID, B.graphicID, AVL.HIGHLIGHT_LINK_COLOR);
	this.cmd("Step");
	
	if (t2 != null)
	{
		this.cmd("Disconnect",B.graphicID, t2.graphicID);
		t2.parent = A;
		A.right = t2;
		this.cmd("Connect", A.graphicID, t2.graphicID, AVL.LINK_COLOR);
	}
	if (t3 != null)
	{
		this.cmd("Disconnect",B.graphicID, t3.graphicID);
		t3.parent = C;
		C.left = t2;
		this.cmd("Connect", C.graphicID, t3.graphicID, AVL.LINK_COLOR);
	}
	if (C.parent == null)
	{
		B.parent = null;
		this.treeRoot = B;
	}
	else
	{
		this.cmd("Disconnect",C.parent.graphicID, C.graphicID);
		this.cmd("Connect",C.parent.graphicID, B.graphicID, AVL.LINK_COLOR);
		if (C.isLeftChild())
		{
			C.parent.left = B
		}
		else
		{
			C.parent.right = B;
		}
		B.parent = C.parent;
		C.parent = B;
	}
	this.cmd("Disconnect", C.graphicID, A.graphicID);
	this.cmd("Disconnect", A.graphicID, B.graphicID);
	this.cmd("Connect", B.graphicID, A.graphicID, AVL.LINK_COLOR);
	this.cmd("Connect", B.graphicID, C.graphicID, AVL.LINK_COLOR);
	B.left = A;
	A.parent = B;
	B.right=C;
	C.parent=B;
	A.right=t2;
	C.left = t3;
	this. resetHeight1(A);
	this. resetHeight1(C);
	this. resetHeight1(B);
	
	this.resizeTree();
	
	
}

AVL.prototype.doubleRotateLeft1 = function(tree)
{
	this.cmd("SetText", 0, "Double Rotate Left");
	// alert("Выполняем большой поворот влево")
	var A = tree;
	var B = tree.right.left;
	var C = tree.right;
	var t1 = A.left;
	var t2 = B.left;
	var t3 = B.right;
	var t4 = C.right;
	
	this.cmd("Disconnect", A.graphicID, C.graphicID);
	this.cmd("Disconnect", C.graphicID, B.graphicID);
	this.cmd("Connect", A.graphicID, C.graphicID, AVL.HIGHLIGHT_LINK_COLOR);
	this.cmd("Connect", C.graphicID, B.graphicID, AVL.HIGHLIGHT_LINK_COLOR);
	this.cmd("Step");
	
	if (t2 != null)
	{
		this.cmd("Disconnect",B.graphicID, t2.graphicID);
		t2.parent = A;
		A.right = t2;
		this.cmd("Connect", A.graphicID, t2.graphicID, AVL.LINK_COLOR);
	}
	if (t3 != null)
	{
		this.cmd("Disconnect",B.graphicID, t3.graphicID);
		t3.parent = C;
		C.left = t2;
		this.cmd("Connect", C.graphicID, t3.graphicID, AVL.LINK_COLOR);
	}
		
	
	if (A.parent == null)
	{
		B.parent = null;
		this.treeRoot = B;
	}
	else
	{
		this.cmd("Disconnect",A.parent.graphicID, A.graphicID);
		this.cmd("Connect",A.parent.graphicID, B.graphicID, AVL.LINK_COLOR);
		if (A.isLeftChild())
		{
			A.parent.left = B
		}
		else
		{
			A.parent.right = B;
		}
		B.parent = A.parent;
		A.parent = B;
	}
	this.cmd("Disconnect", A.graphicID, C.graphicID);
	this.cmd("Disconnect", C.graphicID, B.graphicID);
	this.cmd("Connect", B.graphicID, A.graphicID, AVL.LINK_COLOR);
	this.cmd("Connect", B.graphicID, C.graphicID, AVL.LINK_COLOR);
	B.left = A;
	A.parent = B;
	B.right=C;
	C.parent=B;
	A.right=t2;
	C.left = t3;
	this. resetHeight1(A);
	this. resetHeight1(C);
	this. resetHeight1(B);
	
	this.resizeTree();
	
	
}

AVL.prototype.insert1 = function(elem, tree)
{
	let log = document.getElementById('textblock')

	this.cmd("SetHighlight", tree.graphicID, 1);
	this.cmd("SetHighlight", elem.graphicID, 1);
	
	if (elem.data < tree.data)
	{
		this.cmd("SetText", 0, elem.data + " < " + tree.data + ".  Looking at left subtree");		
		log.innerText += elem.data + " < " + tree.data + ". Идём в лево\n"
	}
	else
	{
		this.cmd("SetText",  0, elem.data + " >= " + tree.data + ".  Looking at right subtree");	
		log.innerText += elem.data + " >= " + tree.data + ". Идём в право\n"
			
	}
	this.cmd("Step");
	this.cmd("SetHighlight", tree.graphicID , 0);
	this.cmd("SetHighlight", elem.graphicID, 0);
	
	if (elem.data < tree.data)
	{
		if (tree.left == null)
		{
			this.cmd("SetText", 0, "Found null tree, inserting element");	
			log.innerText += "Найден пустой лист. Вставляем элемент\n\n"
			
			this.cmd("SetText",elem.heightLabelID,1); 
			
			this.cmd("SetHighlight", elem.graphicID, 0);
			tree.left=elem;
			elem.parent = tree;
			this.cmd("Connect", tree.graphicID, elem.graphicID, AVL.LINK_COLOR);
			
			this.resizeTree();
			this.cmd("CreateHighlightCircle", this.highlightID, AVL.HIGHLIGHT_COLOR, tree.left.x, tree.left.y);
			this.cmd("Move", this.highlightID, tree.x, tree.y);
			this.cmd("SetText",  0, "Unwinding Recursion");			
			this.cmd("Step");
			this.cmd("Delete", this.highlightID);
			
			if (tree.height < tree.left.height + 1)
			{
				tree.height = tree.left.height + 1
				this.cmd("SetText",tree.heightLabelID,tree.height); 
				this.cmd("SetText",  0, "Adjusting height after recursive call");	
				
		
				this.cmd("SetForegroundColor", tree.heightLabelID, AVL.HIGHLIGHT_LABEL_COLOR);
				this.cmd("Step");
				this.cmd("SetForegroundColor", tree.heightLabelID, AVL.HEIGHT_LABEL_COLOR);						
			}
		}
		else
		{
			this.cmd("CreateHighlightCircle", this.highlightID, AVL.HIGHLIGHT_COLOR, tree.x, tree.y);
			this.cmd("Move", this.highlightID, tree.left.x, tree.left.y);
			this.cmd("Step");
			this.cmd("Delete", this.highlightID);
			this.insert1(elem, tree.left);
			this.cmd("CreateHighlightCircle", this.highlightID, AVL.HIGHLIGHT_COLOR, tree.left.x, tree.left.y);
			this.cmd("Move", this.highlightID, tree.x, tree.y);
			this.cmd("SetText",  0,"Unwinding Recursion");			
			this.cmd("Step");
			this.cmd("Delete", this.highlightID);
			
			if (tree.height < tree.left.height + 1)
			{
				tree.height = tree.left.height + 1
				this.cmd("SetText",tree.heightLabelID,tree.height); 
				this.cmd("SetText",  0, "Adjusting height after recursive call");	
				this.cmd("SetForegroundColor", tree.heightLabelID, AVL.HIGHLIGHT_LABEL_COLOR);
				this.cmd("Step");
				this.cmd("SetForegroundColor", tree.heightLabelID, AVL.HEIGHT_LABEL_COLOR);
				
			}
			if ((tree.right != null && tree.left.height > tree.right.height + 1) ||
				(tree.right == null && tree.left.height > 1))
			{
				log.innerText += "Дерево не сбалансировано\n"

				if (elem.data < tree.left.data)
				{
					log.innerText += "Выполняем правый поворот\n"
					this.singleRotateRight1(tree);
				}
				else
				{
					log.innerText += "Выполняем двойной правый поворот\n"

					this.doubleRotateRight1(tree);
				}
			}
		}
	}
	else
	{
		if (tree.right == null)
		{
			this.cmd("SetText",  0, "Found null tree, inserting element");	
			log.innerText += "Найден пустой лист. Вставляем элемент\n\n"
		
			this.cmd("SetText", elem.heightLabelID,1); 
			this.cmd("SetHighlight", elem.graphicID, 0);
			tree.right=elem;
			elem.parent = tree;
			this.cmd("Connect", tree.graphicID, elem.graphicID, AVL.LINK_COLOR);
			elem.x = tree.x + AVL.WIDTH_DELTA/2;
			elem.y = tree.y + AVL.HEIGHT_DELTA
			this.cmd("Move", elem.graphicID, elem.x, elem.y);
			
			this.resizeTree();
			
			
			this.cmd("CreateHighlightCircle", this.highlightID, AVL.HIGHLIGHT_COLOR, tree.right.x, tree.right.y);
			this.cmd("Move", this.highlightID, tree.x, tree.y);
			this.cmd("SetText",  0, "Unwinding Recursion");			
			this.cmd("Step");
			this.cmd("Delete", this.highlightID);
			
			if (tree.height < tree.right.height + 1)
			{
				tree.height = tree.right.height + 1
				this.cmd("SetText",tree.heightLabelID,tree.height); 
				this.cmd("SetText",   0, "Adjusting height after recursive call");	
		
				this.cmd("SetForegroundColor", tree.heightLabelID, AVL.HIGHLIGHT_LABEL_COLOR);
				this.cmd("Step");
				this.cmd("SetForegroundColor", tree.heightLabelID, AVL.HEIGHT_LABEL_COLOR);						
			}
			
		}
		else
		{
			this.cmd("CreateHighlightCircle", this.highlightID, AVL.HIGHLIGHT_COLOR, tree.x, tree.y);
			this.cmd("Move", this.highlightID, tree.right.x, tree.right.y);
			this.cmd("Step");
			this.cmd("Delete", this.highlightID);
			this.insert1(elem, tree.right);
			this.cmd("CreateHighlightCircle", this.highlightID, AVL.HIGHLIGHT_COLOR, tree.right.x, tree.right.y);
			this.cmd("Move", this.highlightID, tree.x, tree.y);
			this.cmd("SetText",  0, "Unwinding Recursion");			
			this.cmd("Step");
			this.cmd("Delete", this.highlightID);
			if (tree.height < tree.right.height + 1)
			{
				tree.height = tree.right.height + 1
				this.cmd("SetText",tree.heightLabelID,tree.height); 
				this.cmd("SetText",  0, "Adjusting height after recursive call");			
				this.cmd("SetForegroundColor", tree.heightLabelID, AVL.HIGHLIGHT_LABEL_COLOR);
				this.cmd("Step");
				this.cmd("SetForegroundColor", tree.heightLabelID, AVL.HEIGHT_LABEL_COLOR);
				
				
			}
			if ((tree.left != null && tree.right.height > tree.left.height + 1) ||
				(tree.left == null && tree.right.height > 1))
			{
				log.innerText += "Дерево не сбалансировано\n"

				if (elem.data >= tree.right.data)
				{
					log.innerText += "Выполняем левый поворот\n"

					this.singleRotateLeft1(tree);
				}
				else
				{
					log.innerText += "Выполняем двойной левый поворот\n"

					this.doubleRotateLeft1(tree);
				}
			}
		}
	}
	
	
}


/*******************************************************************************/
AVL.prototype.deleteElement = function(deletedValue)
{
	let log = document.getElementById('textblock')
	$('#infocode').css('width', '360px');
	$('#test234').addClass("rotateclass")
	log.innerText = ""

	this.commands = [];
	this.cmd("SetText", 0, "Deleting "+deletedValue);
	log.innerText = "Удаляем " + deletedValue + '\n\n'
	this.cmd("Step");
	this.cmd("SetText", 0, " ");
	this.highlightID = this.nextIndex++;
	this.treeDelete(this.treeRoot, deletedValue);
	this.cmd("SetText", 0, " ");			
	return this.commands;						
}

AVL.prototype.treeDelete = function(tree, valueToDelete)
{
	let log = document.getElementById('textblock')

	var leftchild = false;
	if (tree != null)
	{
		if (tree.parent != null)
		{
			leftchild = tree.parent.left == tree;
		}
		this.cmd("SetHighlight", tree.graphicID, 1);
		if (valueToDelete < tree.data)
		{	
			this.cmd("SetText", 0, valueToDelete + " < " + tree.data + ".  Looking at left subtree");		
			log.innerText += valueToDelete + " < " + tree.data + ".\n  Идем в лево\n\n"		
		}
		else if (valueToDelete > tree.data)
		{
			this.cmd("SetText", 0, valueToDelete + " > " + tree.data + ".  Looking at right subtree");		
			log.innerText += valueToDelete + " > " + tree.data + ".\n  Идем в право\n\n"		
		
		}
		else
		{
			this.cmd("SetText", 0, valueToDelete + " == " + tree.data + ".  Found node to delete");		
			log.innerText += valueToDelete + " == " + tree.data + ".\n  Найден элемент для удаления\n\n"		
		}
		this.cmd("Step");
		this.cmd("SetHighlight", tree.graphicID, 0);
		
		if (valueToDelete == tree.data)
		{
			if (tree.left == null && tree.right == null)
			{
				this.cmd("SetText",  0, "Node to delete is a leaf.  Delete it.");	
				log.innerText += "Элемент для удаления лист. Удаляем его\n\n"		
								
				this.cmd("Delete", tree.graphicID);
				this.cmd("Delete", tree.heightLabelID);
				if (leftchild && tree.parent != null)
				{
					tree.parent.left = null;
				}
				else if (tree.parent != null)
				{
					tree.parent.right = null;
				}
				else
				{
					this.treeRoot = null;
				}
				this.resizeTree();				
				this.cmd("Step");
				
			}
			else if (tree.left == null)
			{
				this.cmd("SetText", 0, "Node to delete has no left child.  \nSet parent of deleted node to right child of deleted node.");
				log.innerText += "Узел для удаления не имеет левого дочернего элемента.\n Установим родительский элемент удаленного узла на правый дочерний элемент удаленного узла."	+ '\n'+ '\n'								
									
				if (tree.parent != null)
				{
					this.cmd("Disconnect", tree.parent.graphicID, tree.graphicID);
					this.cmd("Connect", tree.parent.graphicID, tree.right.graphicID, AVL.LINK_COLOR);
					this.cmd("Step");
					this.cmd("Delete", tree.graphicID);
					this.cmd("Delete", tree.heightLabelID);
					if (leftchild)
					{
						tree.parent.left = tree.right;
					}
					else
					{
						tree.parent.right = tree.right;
					}
					tree.right.parent = tree.parent;
				}
				else
				{
					this.cmd("Delete", tree.graphicID);
					this.cmd("Delete", tree.heightLabelID);
					this.treeRoot = tree.right;
					this.treeRoot.parent = null;
				}
				this.resizeTree();				
			}
			else if (tree.right == null)
			{
				this.cmd("SetText",  0,"Node to delete has no right child.  \nSet parent of deleted node to left child of deleted node.");	
				log.innerText += "Узел для удаления не имеет правого дочернего элемента.\n'\n' Установим родительский элемент удаленного узла на левый дочерний элемент удаленного узла."	+ '\n'+ '\n'								
								
				if (tree.parent != null)
				{
					this.cmd("Disconnect", tree.parent.graphicID, tree.graphicID);
					this.cmd("Connect", tree.parent.graphicID, tree.left.graphicID, AVL.LINK_COLOR);
					this.cmd("Step");
					this.cmd("Delete", tree.graphicID);
					this.cmd("Delete", tree.heightLabelID);
					if (leftchild)
					{
						tree.parent.left = tree.left;								
					}
					else
					{
						tree.parent.right = tree.left;
					}
					tree.left.parent = tree.parent;
				}
				else
				{
					this.cmd("Delete" , tree.graphicID);
					this.cmd("Delete", tree.heightLabelID);
					this.treeRoot = tree.left;
					this.treeRoot.parent = null;
				}
				this.resizeTree();
			}
			else // tree.left != null && tree.right != null
			{
				this.cmd("SetText", 0, "Node to delete has two childern.  \nFind largest node in left subtree.");
				log.innerText += "Узел для удаления имеет два дочерних элемента.\n\n Ищем наибольший узел в левом поддереве."	+ '\n'	+ '\n'								
									
				
				this.highlightID = this.nextIndex;
				this.nextIndex += 1;
				this.cmd("CreateHighlightCircle", this.highlightID, AVL.HIGHLIGHT_COLOR, tree.x, tree.y);
				var tmp = tree;
				tmp = tree.left;
				this.cmd("Move", this.highlightID, tmp.x, tmp.y);
				this.cmd("Step");																									
				while (tmp.right != null)
				{
					tmp = tmp.right;
					this.cmd("Move", this.highlightID, tmp.x, tmp.y);
					this.cmd("Step");																									
				}
				this.cmd("SetText", tree.graphicID, " ");
				var labelID = this.nextIndex;
				this.nextIndex += 1;
				this.cmd("CreateLabel", labelID, tmp.data, tmp.x, tmp.y);
				this.cmd("SetForegroundColor", labelID, AVL.HEIGHT_LABEL_COLOR);
				tree.data = tmp.data;
				this.cmd("Move", labelID, tree.x, tree.y);
				this.cmd("SetText", 0, "Copy largest value of left subtree into node to delete.");		
				log.innerText += "Копируем наибольшее значение с левого поддерева в узел для удаления."	+ '\n'	+ '\n'								
							
				
				this.cmd("Step");
				this.cmd("SetHighlight", tree.graphicID, 0);
				this.cmd("Delete", labelID);
				this.cmd("SetText", tree.graphicID, tree.data);
				this.cmd("Delete", this.highlightID);							
				this.cmd("SetText", 0, "Remove node whose value we copied.");									
				log.innerText += "Удаляем узел, значение которого мы скопировали"	+ '\n'	+ '\n'								

				
				if (tmp.left == null)
				{
					if (tmp.parent != tree)
					{
						tmp.parent.right = null;
					}
					else
					{
						tree.left = null;
					}
					this.cmd("Delete", tmp.graphicID);
					this.cmd("Delete", tmp.heightLabelID);
					this.resizeTree();
				}
				else
				{
					this.cmd("Disconnect", tmp.parent.graphicID, tmp.graphicID);
					this.cmd("Connect", tmp.parent.graphicID, tmp.left.graphicID, AVL.LINK_COLOR);
					this.cmd("Step");
					this.cmd("Delete", tmp.graphicID);
					this.cmd("Delete", tmp.heightLabelID);
					if (tmp.parent != tree)
					{
						tmp.parent.right = tmp.left;
						tmp.left.parent = tmp.parent;
					}
					else
					{
						tree.left = tmp.left;
						tmp.left.parent = tree;
					}
					this.resizeTree();
				}
				tmp = tmp.parent;
				
				if (this.getHeight(tmp) != Math.max(this.getHeight(tmp.left), this.getHeight(tmp.right)) + 1)
				{
					tmp.height = Math.max(this.getHeight(tmp.left), this.getHeight(tmp.right)) + 1
					this.cmd("SetText",tmp.heightLabelID,tmp.height); 
					this.cmd("SetText",  0, "Adjusting height after recursive call");			
					this.cmd("SetForegroundColor", tmp.heightLabelID, AVL.HIGHLIGHT_LABEL_COLOR);
					this.cmd("Step");
					this.cmd("SetForegroundColor", tmp.heightLabelID, AVL.HEIGHT_LABEL_COLOR);						
				}
				
				
				
				while (tmp != tree)
				{
					var tmpPar = tmp.parent;
					// TODO:  Add extra animation here?
					if (this.getHeight(tmp.left)- this.getHeight(tmp.right) > 1)
					{
						if (this.getHeight(tmp.left.right) > this.getHeight(tmp.left.left))
						{
							this.doubleRotateRight(tmp);
						}
						else
						{
							this.singleRotateRight(tmp);
						}
					}
					if (tmpPar.right != null)
					{
						if (tmpPar == tree)
						{
							this.cmd("CreateHighlightCircle", this.highlightID, AVL.HIGHLIGHT_COLOR, tmpPar.left.x, tmpPar.left.y);
							
						}
						else
						{
							this.cmd("CreateHighlightCircle", this.highlightID, AVL.HIGHLIGHT_COLOR, tmpPar.right.x, tmpPar.right.y);
						}
						this.cmd("Move", this.highlightID, tmpPar.x, tmpPar.y);
						this.cmd("SetText",  0, "Backing up ...");			
						
			if (this.getHeight(tmpPar) != Math.max(this.getHeight(tmpPar.left), this.getHeight(tmpPar.right)) + 1)
			{
				tmpPar.height = Math.max(this.getHeight(tmpPar.left), this.getHeight(tmpPar.right)) + 1
				this.cmd("SetText",tmpPar.heightLabelID,tree.height); 
				this.cmd("SetText",  0, "Adjusting height after recursive call");			
				this.cmd("SetForegroundColor", tmpPar.heightLabelID, AVL.HIGHLIGHT_LABEL_COLOR);
				this.cmd("Step");
				this.cmd("SetForegroundColor", tmpPar.heightLabelID, AVL.HEIGHT_LABEL_COLOR);						
			}

//28,15,50,7,22,39,55,10,33,42,63,30 .
					    

						this.cmd("Step");
						this.cmd("Delete", this.highlightID);
					}
					tmp = tmpPar;
				}
				if (this.getHeight(tree.right)- this.getHeight(tree.left) > 1)
				{
					if (this.getHeight(tree.right.left) > this.getHeight(tree.right.right))
					{
						this.doubleRotateLeft(tree);
					}
					else
					{
						this.singleRotateLeft(tree);
					}					
				}
				
			}
		}
		else if (valueToDelete < tree.data)
		{
			if (tree.left != null)
			{
				this.cmd("CreateHighlightCircle", this.highlightID, AVL.HIGHLIGHT_COLOR, tree.x, tree.y);
				this.cmd("Move", this.highlightID, tree.left.x, tree.left.y);
				this.cmd("Step");
				this.cmd("Delete", this.highlightID);
			}
			this.treeDelete(tree.left, valueToDelete);
			if (tree.left != null)
			{
				this.cmd("SetText", 0, "Unwinding recursion.");
				this.cmd("CreateHighlightCircle", this.highlightID, AVL.HIGHLIGHT_COLOR, tree.left.x, tree.left.y);
				this.cmd("Move", this.highlightID, tree.x, tree.y);
				this.cmd("Step");
				this.cmd("Delete", this.highlightID);
			}
			if (this.getHeight(tree.right)- this.getHeight(tree.left) > 1)
			{
				log.innerText += "Дерево не сбалансировано\n"

				if (this.getHeight(tree.right.left) > this.getHeight(tree.right.right))
				{
					log.innerText += "Выполняем двойной левый поворот\n"
					this.doubleRotateLeft(tree);
				}
				else
				{
					log.innerText += "Выполняем левый поворот\n"
					this.singleRotateLeft(tree);
				}					
			}
			if (this.getHeight(tree) != Math.max(this.getHeight(tree.left), this.getHeight(tree.right)) + 1)
			{
				tree.height = Math.max(this.getHeight(tree.left), this.getHeight(tree.right)) + 1
				this.cmd("SetText",tree.heightLabelID,tree.height); 
				this.cmd("SetText",  0, "Adjusting height after recursive call");			
				this.cmd("SetForegroundColor", tree.heightLabelID, AVL.HIGHLIGHT_LABEL_COLOR);
				this.cmd("Step");
				this.cmd("SetForegroundColor", tree.heightLabelID, AVL.HEIGHT_LABEL_COLOR);						
			}
		}
		else
		{
			if (tree.right != null)
			{
				this.cmd("CreateHighlightCircle", this.highlightID, AVL.HIGHLIGHT_COLOR, tree.x, tree.y);
				this.cmd("Move", this.highlightID, tree.right.x, tree.right.y);
				this.cmd("Step");
				this.cmd("Delete", this.highlightID);
			}
			this.treeDelete(tree.right, valueToDelete);
			if (tree.right != null)
			{
				this.cmd("SetText", 0, "Unwinding recursion.");
				this.cmd("CreateHighlightCircle", this.highlightID, AVL.HIGHLIGHT_COLOR, tree.right.x, tree.right.y);
				this.cmd("Move", this.highlightID, tree.x, tree.y);
				this.cmd("Step");
				this.cmd("Delete", this.highlightID);
			}
			
			
			if (this.getHeight(tree.left)- this.getHeight(tree.right) > 1)
			{
				log.innerText += "Дерево не сбалансировано\n"

				if (this.getHeight(tree.left.right) > this.getHeight(tree.left.left))
				{
					log.innerText += "Выполняем двойной правый поворот\n"

					this.doubleRotateRight(tree);
				}
				else
				{
					log.innerText += "Выполняем правый поворот\n"

					this.singleRotateRight(tree);
				}					
			}
			if (this.getHeight(tree) != Math.max(this.getHeight(tree.left), this.getHeight(tree.right)) + 1)
			{
				tree.height = Math.max(this.getHeight(tree.left), this.getHeight(tree.right)) + 1
				this.cmd("SetText",tree.heightLabelID,tree.height); 
				this.cmd("SetText",  0, "Adjusting height after recursive call");			
				this.cmd("SetForegroundColor", tree.heightLabelID, AVL.HIGHLIGHT_LABEL_COLOR);
				this.cmd("Step");
				this.cmd("SetForegroundColor", tree.heightLabelID, AVL.HEIGHT_LABEL_COLOR);						
			}
			
			
		}
	}
	else
	{
		this.cmd("SetText", 0, "Elemet "+valueToDelete+" not found, could not delete");
		log.innerText += "Элемент для удаления не найден"	+ '\n'	+ '\n'								

	}
	
}

AVL.prototype.resizeTree = function()
{
	var startingPoint  = this.startingX;
	this.resizeWidths(this.treeRoot);
	if (this.treeRoot != null)
	{
		if (this.treeRoot.leftWidth > startingPoint)
		{
			startingPoint = this.treeRoot.leftWidth;
		}
		else if (this.treeRoot.rightWidth > startingPoint)
		{
			startingPoint = Math.max(this.treeRoot.leftWidth, 2 * startingPoint - this.treeRoot.rightWidth);
		}
		this.setNewPositions(this.treeRoot, startingPoint, AVL.STARTING_Y, 0);
		this.animateNewPositions(this.treeRoot);
		this.cmd("Step");
	}
	
}

AVL.prototype.setNewPositions = function(tree, xPosition, yPosition, side)
{
	if (tree != null)
	{
		tree.y = yPosition;
		if (side == -1)
		{
			xPosition = xPosition - tree.rightWidth;
			tree.heightLabelX = xPosition - 20;
		}
		else if (side == 1)
		{
			xPosition = xPosition + tree.leftWidth;
			tree.heightLabelX = xPosition + 20;
		}
		else
		{
			tree.heightLabelX = xPosition - 20;
		}
		tree.x = xPosition;
		tree.heightLabelY = tree.y - 20;
		this.setNewPositions(tree.left, xPosition, yPosition + AVL.HEIGHT_DELTA, -1)
		this.setNewPositions(tree.right, xPosition, yPosition + AVL.HEIGHT_DELTA, 1)
	}
	
}
AVL.prototype.animateNewPositions = function(tree)
{
	if (tree != null)
	{
		this.cmd("Move", tree.graphicID, tree.x, tree.y);
		this.cmd("Move", tree.heightLabelID, tree.heightLabelX, tree.heightLabelY);
		this.animateNewPositions(tree.left);
		this.animateNewPositions(tree.right);
	}
}

AVL.prototype.resizeWidths = function(tree) 
{
	if (tree == null)
	{
		return 0;
	}
	tree.leftWidth = Math.max(this.resizeWidths(tree.left), AVL.WIDTH_DELTA / 2);
	tree.rightWidth = Math.max(this.resizeWidths(tree.right), AVL.WIDTH_DELTA / 2);
	return tree.leftWidth + tree.rightWidth;
}


AVL.prototype.disableUI = function(event)
{
	this.insertField.disabled = true;
	this.insertButton.disabled = true;
	this.deleteField.disabled = true;
	this.deleteButton.disabled = true;
	this.findField.disabled = true;
	this.findButton.disabled = true;
	this.printButton.disabled = true;
	this.printRandButton.disabled = true;
	this.deleteTreeButton.disabled = true;
}

AVL.prototype.enableUI = function(event)
{
	this.insertField.disabled = false;
	this.insertButton.disabled = false;
	this.deleteField.disabled = false;
	this.deleteButton.disabled = false;
	this.findField.disabled = false;
	this.findButton.disabled = false;
	this.printButton.disabled = false;
	this.printRandButton.disabled = false;
	this.deleteTreeButton.disabled = false;
}

		
function AVLNode(val, id, hid, initialX, initialY)
{
	this.data = val;
	this.x = initialX;
	this.y = initialY;
	this.heightLabelID= hid;
	this.height = 1;
	
	this.graphicID = id;
	this.left = null;
	this.right = null;
	this.parent = null;
}
		
AVLNode.prototype.isLeftChild = function()		
{
	if (this. parent == null)
	{
		return true;
	}
	return this.parent.left == this;	
}




var currentAlg;

function init()
{
	var animManag = initCanvas();
	currentAlg = new AVL(animManag, canvas.width, canvas.height);
}


function addclass3(){
	// document.querySelector('#test231').classList.toogle("rotateclass")

	// window.console.log(this)
	// window.console.log("im here")
	$('#test233').toggleClass("rotateclass")
}

function addclass4(){
	if ($('#test234').hasClass( "rotateclass" )) {
		$('#test234').removeClass("rotateclass")
		// $('#infocode').style = "width: 0px;"

	}
	else {
		$('#test234').addClass("rotateclass")
		// $('#infocode').style= "width: 420px";
	}

	if ($('#infocode').css('width') == '360px') {
		$('#infocode').css('width', '0');
	}
	else{
		$('#infocode').css('width', '360px');

	}
}


function delhistory(){
	let log = document.getElementById('textblock')
	log.innerText = ""

}