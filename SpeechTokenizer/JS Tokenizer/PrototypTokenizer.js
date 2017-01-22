var sentence = 'The dog ran to the other side of the field.',
	
common = 'a, able, about, above,abst,accordance,according,accordingly,and,across,act,actually,added,adj,affected, affecting, affects, after, afterwards,\
again,against,ah,all,almost,alone,along,already,also,although,always,am,among,amongst,an,and,announce,another,any,anybody,anyhow,anymore,anyone,anything,anyway,\
anyways,anywhere,apparently,approximately,are,aren,arent,arise,around,as,aside,ask,asking,at,auth,available,away,awfully,back,be,bad,became,because,become,becomes,\
becoming,been,before,beforehand,begin,beginning,beginnings,begins,behind,being,believe,below,beside,besides,between,beyond,biol,both,brief,briefly,but,by,c,ca,came,\
can,cannot,causes,certain,certainly,co,com,come,comes,contain,containing,contains,could,couldnt,d,date,did,didnt, different, do, does, doesnt, can,cannot, doing,done,\
dont,down,downwards,due,during,e,each,ed,edu,effect,eg,eight,eighty,either,else,elsewhere,end,ending,enough,especially,et,et-al,etc,even,ever,every,everybody,everyone,\
everything,everywhere,ex,except,f,ff,fifth,first,five,fix,followed,following,follows,for,former,formerly,forth,found,four,from,further,furthermore,g,gave,get,gets,getting,goodbye\
give,given,gives,giving,go,goes,gone,got,gotten,h,had,happens,hardly,has,hasnt,have,havent,having,he,hed,hence,her,here,hello,hereafter,hereby,herein,heres,hereupon,hers,herself,\
hes,hi,hid,him,himself,his,hither,home,how,howbeit,however,hundred,i,id,is,ie,if,ill,im,immediate,immediately,importance,important, in,inc,indeed,index,information,instead,into,\
invention,inward,is,isnt,it,itd,itll,its,itself,ive,j,just,k,keep,keeps,kept,kg,km,know,known,knows,l,largely,last,lately,later,latter,latterly,least,less,lest,let,lets,like,\
liked,likely,line,little, look,looking,looks,ltd,m,made,mainly,make,makes,many,may,maybe,me,mean,means,meantime,meanwhile,merely,mg,might,million,miss,ml,more,moreover,most,\
mostly,mr,mrs,much,mug,must,my,myself,n,na,name,namely,nay,nd,near,nearly,necessarily,necessary,need,needs,neither,never,nevertheless,new,next,nice,nine,ninety,no,nobody,non,none,\
nonetheless,noone,nor,normally,nos,not,noted,nothing,now,nowhere,o,ok,obtain,obtained,obviously,of,off,often,oh,ok,okay,old,omitted,on,once,one,ones,only,onto,or,ord,other,others,\
otherwise,ought,our,ours,ourselves,out,outside,over,overall,owing,own,p,page,pages,part,particular,particularly,past,per,perhaps,placed,please,plus,poorly,possible,possibly,\
potentially,pp,predominantly,present,previously,primarily,probably,promptly,proud,provides,put,q,que,quickly,quite,qv,r,ran,rather,rd,re,readily,really,recent,recently,ref,refs,\
regarding,regardless,regards,related,relatively,research,respectively,resulted,resulting,results,right,run,s,said,same,saw,say,saying,says,sec,section,see,seeing,seem,seemed,\
seeming,seems,seen,self,selves,sent,seven,several,shall,she,shed,shell,shes,should,shouldnt,show,showed,shown,showns,shows,significant,significantly,similar,similarly,since,six,\
slightly,so,some,somebody,somehow,someone,somethan,something,sometime,sometimes,somewhat,somewhere,soon,sorry,specifically,specified,specify,specifying,still,stop,strongly,sub,\
substantially,successfully,such,sufficiently,suggest,sup,sure,t,take,taken,taking,tell,tends,th,than,thank,thanks,thanx,that,thatll,thats,the,their,theirs,them,themselves,then,\
thence,there,thereafter,thereby,thered,therefore,therein,therell,thereof,therere,theres,thereto,thereupon,these,they,theyd,theyre,think,this,those,thou,though,thoughh,thousand,\
throug,through,throughout,thru,thus,til, dog,tip,to,together,too,took,or,toward,towards,tried,tries,truly,try,trying,ts,twice,two,u,un,under,unfortunately,unless,unlike,unlikely,until,\
unto,up,upon,ups,us,use,used,useful,usefully,usefulness,uses,using,usually,v,value,various,very,via,viz,vol,vols,vs,w,want,wants,was,wasnt,way,we,wed,welcome,went,were,werent,\
weve,what,whatever,whats,when,whence,whenever,where,whereafter,whereas,whereby,wherein,wheres,whereupon,wherever,whether,which,while,whim,whither,who,whod,whoever,whole,whom,\
whomever,whos,whose,why,widely,willing,wish,with,within,without,words,world,would,wouldnt,www,x,y,yes,yet,you,youd,your,youre,yours,yourself,yourselves,zero';

/**
* (getUncommon): Funktion um ungebräuchliche bzw. unübliche Wörter zu filtern.
* stopwords: Hier wird das Objekt (commonObj) mit den übligen Stoppwörtern (common) befüllt.
*/

function getUncommon(sentence, common) {
    var wordArr = sentence.match(/\w+/g),
        commonObj = {},
        uncommonArr = [],
        word, i;
    
    common = common.split(',');
    for ( i = 0; i < common.length; i++ ) {
        commonObj[ common[i].trim() ] = true;
    }
    
/**
* In diesem Bereich wird überprüft, ob die Wörter bzw. das Textresultat vom Audiostream mit den Stoppwörtern übereineinstimmen
* Falls dies nicht der Fall ist, werden sie den Array "uncommonArr" gepusht. Hier liegen dann die wichtigen Tokens
*/
    for ( i = 0; i < wordArr.length; i++ ) {
        word = wordArr[i].trim().toLowerCase();
        if ( !commonObj[word] ) {
            uncommonArr.push(word);
        }
    }
    
    return uncommonArr;
}

document.write( getUncommon(sentence, common) );


