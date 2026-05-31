//importing the required jsons
import wordlList from './wordles.json' with {type:'json'};
import guessList from './nonwordles.json'  with {type:'json'};

//function to show the welcome screen of gameboy whenever use lands on base url
window.onload = function()
{
    setTimeout(()=>
    {
        //making the menu and welcome screen visible
        document.getElementsByClassName('gameboy_welcomeScreen')[0].classList.add('visible');
        document.getElementsByClassName('gameboy_menu')[0].classList.add('visible');
        },500);


}

class matrixgird
{
    constructor(){
        this.fixedRow=0;
        this.fixedPosition=[-1,-1];
        this.rowArr=[];
        this.isreveal=false;
        this.charmap= {};
    }

    //compute the location of empty cell and return it
    computeEmptyCell()
    {
        const matrix=document.getElementsByClassName('wordleMatrix')[0];
        const matrixRows=6;
        const matrixCols=5;
        for(let row=0;row<matrixRows;row++)
        {
            for(let col=0;col<matrixCols;col++)
            {
                const cell=document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
                if(cell.textContent==="")
                {
                    return cell
                }
            }
        }
        return document.querySelector('[data-row="5"][data-col="4"]');

    }
 
    //reset the wordle matrix 
    playgame()
    {
        //selecting a random word from wordles.json to be a target word
        const randIndx= Math.floor(Math.random()*wordlList.length+1);
        localStorage.setItem('target',wordlList[randIndx]);

         //hide the welcom screen and menu
        document.getElementsByClassName('gameboy_menu')[0].classList.remove('visible');
        document.getElementsByClassName('gameboy_welcomeScreen')[0].classList.remove('visible');

        //hide the modal screen
        const modal=document.getElementsByClassName('modal')[0];
        modal.classList.remove('visible');

        //construct a wordle matrix
        const gridContainer = document.getElementsByClassName('wordleMatrix')[0];
        gridContainer.classList.add('visible');

        //construct the keyboard for wordle input
        const keyboardGrid= document.getElementsByClassName('keyboardGrid')[0];
        keyboardGrid.classList.remove('visible');
        
        
        setTimeout(() => {

            
            const rows=6;
            const cols=5;

            //creating cells of the keyboard
            for(let i=0;i<rows;i++)
            {
                for(let j=0;j<cols;j++)
                {
                    const cell=document.createElement('div');
                    cell.classList.add('cell');
                    cell.classList.add('visibleCell')
                    cell.classList.add('cellAnimation');
                    cell.dataset.row=i;
                    cell.dataset.col=j;
                    gridContainer.appendChild(cell);
                }

            }

            //creating keys of the keyboard
            let alpha=65;
            for(let row=6;row<10;row++)
            {
                for(let col=0;col<7;col++)
                {
                    const char=String.fromCharCode(alpha);
                    const key=document.createElement('button');
                    key.dataset.row=row;
                    key.dataset.col=col;
                    this.charmap[char]=[row,col];
                    if(row===9 && col===0)
                    { 
                        key.classList.add('enter');
                        keyboardGrid.appendChild(document.createElement('div'));
                        key.textContent="Enter";row
                        
                    }
                    else if(row===9 && col==6)
                    {
                        key.classList.add('backspace');
                        key.textContent='\u232B';

                    }
                    else
                    {
                        key.classList.add('key');
                        key.textContent=char;
                        alpha++;

                    }
                    keyboardGrid.appendChild(key);
                    


                }

            }
            keyboardGrid.classList.add('visible');

            
        }, 1000);
        
    }

 

    //convert array into objects for computation
    createWordleObject(target)
    {
        const targetObj={}; 
        for(let i=0;i<5;i++)
        {
            if(target[i] in targetObj){
                targetObj[target[i]].pos.add(i);
                targetObj[target[i]].freq++;

            }
            else{
                targetObj[target[i]]=
                {
                    pos:new Set([i]),
                    freq:1

                }
                
            }
        }
        return targetObj;
    }

    //helper function to verify wordle positions and add animation
    verifyWordlePositions(wordle,fixedRow)
    {
    const target=localStorage.getItem('target');
    const targetObj=this.createWordleObject(target);
    const wordleObj=this.createWordleObject(wordle);
    const res= new Array(5).fill(-1);


    for(let indx=0;indx<5;indx++)
    {
        let char=wordle[indx];
        if(char in targetObj)
        {
            let samePos=wordleObj[char].pos.intersection(targetObj[char].pos);
            let diffPos=wordleObj[char].pos.difference(targetObj[char].pos);
            for(const pos of samePos)
            { res[pos]=1}
            let remainingPos= targetObj[char].freq-samePos.size;
            if(remainingPos>0){
                for(const pos of diffPos){
                    res[pos]=0;
                }
            }

        }
    }

    for(let indx=0;indx<5;indx++)
    {
        matrixObj.isreveal=true;
        setTimeout(()=>
        {

            //
            const char=wordle[indx].toUpperCase();

            //select cell by locator
            const cell=document.querySelector(`[data-row="${fixedRow}"][data-col="${indx}"]`);


            //verify the each cell char and position
            if(res[indx]===1)
            {    
                //char exists and the position is right    
                cell.classList.add('match');
                if(char in this.charmap)
                {
                    const row=this.charmap[char][0];
                    const col= this.charmap[char][1];
                    const key=document.querySelector(`[data-row="${row}"][data-col="${col}"]`)
                    if(!key.classList.contains('match'))
                    {
                        key.classList.add('match');
                    }
                }

            }
            else if(res[indx]===0)
            {
                //char exists but the position is wrong
                cell.classList.add('partialmatch');
                if(char in this.charmap)
                {
                    const row=this.charmap[char][0];
                    const col= this.charmap[char][1];
                    const key=document.querySelector(`[data-row="${row}"][data-col="${col}"]`)
                                       
                    if(!key.classList.contains('partialmatch'))
                    {
                        key.classList.add('partialmatch');
                    }
                }

            }
            else{
                //neither position nor char exists
                cell.classList.add('mismatch');
                if(char in this.charmap)
                {
                    const row=this.charmap[char][0];
                    const col= this.charmap[char][1];
                    
                    const key=document.querySelector(`[data-row="${row}"][data-col="${col}"]`)
                    if(!key.classList.contains('mismatch'))
                    {
                        key.classList.add('mismatch');
                    }
                }
            }
                
        },indx*250);
           }

        //banning any action while text reveal is going on
        setTimeout(() => {
            matrixObj.isreveal=false;
            
        }, 1200);
    }

    //handle press and click key inputs
    handleInput(word)
    {
        const cell=this.computeEmptyCell();
        //only accept enter or backspace keys if user is at last cell of the matrix
        if( word!="Enter" && word!="Backspace" && this.fixedPosition[0]===4 && this.fixedPosition[1]===5)
        {
            return 
        }

        const cellRow=parseInt(cell.dataset.row,10);
        const cellCol=parseInt(cell.dataset.col,10);
        const toastText=document.getElementsByClassName('alert')[0];
        const toast=document.getElementsByClassName('toast_alert')[0];
        const modal=document.getElementsByClassName('modal')[0];
        const modalText= document.getElementsByClassName('modalText')[0];
        const modalButton = document.getElementsByClassName('modalButton')[0];

        

       //handle case if user enter any char between A-Z
        if(/^[A-Z]$/.test(word.toUpperCase()) && this.fixedRow===cellRow)
        {
            cell.textContent=word.toUpperCase();
            this.rowArr.push(word); //pushed the entered char in the row array
            this.fixedPosition=[cellRow,cellCol];       

        }
        //handle case if user press Enter
        else if(word==="Enter" )
        {
            //join the chars to make wordle
            const wordle=this.rowArr.join("").toLowerCase();

            //if wordle is not of 5 word length
            if(wordle.length<5)
            {
                
                toastText.textContent="Not enough letters";
                toast.classList.add('visibleCell');
                setTimeout(()=>
                { 
                    toast.classList.remove('visibleCell');
                },1000);

            }

            //if wordle is not a valid word
            else if(!wordlList.includes(wordle) && !guessList.includes(wordle))
            {

                toastText.textContent="Not a valid word";
                toast.classList.add('visibleCell');
                setTimeout(()=>
                { 
                    toast.classList.remove('visibleCell');
                },1000);



            }

            //if wordle matched the target word
            else if(wordle===localStorage.getItem('target'))
            {

                this.verifyWordlePositions(wordle,this.fixedRow);
                setTimeout(() => {
                    modal.classList.add('visible');
                    modalText.textContent="YOU WON!!!"
                    modalButton.textContent="Play Again"
                    this.rowArr=[];
                    this.fixedRow=0;
                    this.fixedPosition=[-1,-1];

                    
                    
                }, 1300);
            }

            //if wordle is a valid guess
            else if(wordlList.includes(wordle) || guessList.includes(wordle))
            {
                this.verifyWordlePositions(wordle,this.fixedRow);
                this.fixedRow++;
                this.rowArr=[];
            }

            
            
            //if enter is pressed at last cell of matrix
            if (this.fixedRow>5)
            {
                setTimeout(() => {
                    modal.classList.add('visible');
                    modalText.textContent=`Word was - ${localStorage.getItem('target')} `
                    modalButton.textContent="Play Again"
                    this.fixedRow=0;
                    this.fixedPosition=[-1,-1];
                    this.rowArr=[];
                    
                }, 1300);

            }

        }

        //handle case if user press Backspace
        else if(word==="Backspace" && this.fixedPosition[0]===this.fixedRow )
        {
            const tempCell=document.querySelector(`[data-row="${this.fixedPosition[0]}"][data-col="${matrixObj.fixedPosition[1]}"]`);
            if (tempCell.textContent!="")
            {
                tempCell.textContent="";
                this.rowArr.pop();
                if(this.fixedPosition[1]>0){ this.fixedPosition[1]--;}
            }

        }


    }

    openModal(aboutPopup)
    {
        aboutPopup.classList.add('visibleAbout');

    }

    closeModal(aboutPopup)
    {
        aboutPopup.classList.remove('visibleAbout');

    }


}

//creating object of matrix class
const matrixObj= new matrixgird();

//clicking play will start the game
const playButton = document.querySelector('#playbutton');
const playagain = document.querySelector('#modalButton');
const gridContainer = document.getElementsByClassName('wordleMatrix')[0];
const openButton= document.getElementsByClassName('aboutbutton')[0];
const closeButton = document.getElementsByClassName('close')[0];
const aboutPopup = document.getElementsByClassName('about')[0];
const keys= document.getElementsByClassName('keyboardGrid')[0];

openButton.addEventListener('click',()=> matrixObj.openModal(aboutPopup));
closeButton.addEventListener('click',()=> matrixObj.closeModal(aboutPopup));




playagain.addEventListener('click',()=>{
    gridContainer.innerHTML="";
    keys.innerHTML="";
    matrixObj.playgame()});
playButton.addEventListener('click',()=>matrixObj.playgame());

//handle the key presses for wordle from keyboard
    document.addEventListener('keydown',(e)=>
    {
        if(matrixObj.isreveal){
            return 
        }

        //verify if wordle matrix is visible
        const matrix=document.getElementsByClassName('wordleMatrix')[0];
        if (!matrix.classList.contains('visible') || window.getComputedStyle(matrix).transform!=='matrix(1, 0, 0, 1, 0, 0)'){
            return }
        
        //dont accept click from keyboar
        if(document.activeElement.classList.contains('key'))
        { return }

        if(!e.repeat)
        {
        matrixObj.handleInput(e.key);
        }
               
    })
//handle the key click for wordle from keyboard
keys.addEventListener('click',(e)=>
{
    if(e.target.classList.contains('key'))
    {
        matrixObj.handleInput(e.target.textContent);
    }
    else if(e.target.classList.contains('enter'))
    {
        matrixObj.handleInput('Enter')
    }
    else if(e.target.classList.contains('backspace'))
    {
        matrixObj.handleInput('Backspace');
    }
    e.target.blur();
})









