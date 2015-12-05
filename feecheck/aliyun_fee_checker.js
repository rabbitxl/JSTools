function timedGetText( url, time, callback ){
    var request = new XMLHttpRequest();
    var timeout = false;
    var timer = setTimeout( function(){
        timeout = true;
        request.abort();
    }, time );
    request.open( "GET", url );
    request.onreadystatechange = function(){
        if( request.readyState !== 4 ) return;
        if( timeout ) return;
        clearTimeout( timer );
        if( request.status === 200 ){
            callback( request.responseText );
        }
    }
    request.send( null );
}

var billlist = "https://expense.console.aliyun.com/consumption/getAfterPayBillList.json?__preventCache=1449283682553&accountPeriod=&endTime=1449281935053&needZeroBill=true&pageNum=1&pageSize=120&parentProductCode=EMRPOST&payStatus=&productCode=&startTime=1448899200000"


var detail = "https://expense.console.aliyun.com/consumption/listDetailInstanceByBillRegion.json?__preventCache=1449285368682&pageNum=1&pageSize=20&billId="

var clusterDetail = "https://expense.console.aliyun.com/consumption/listInstanceResInfos.json?__preventCache=1449292703010&prodCode=emrpost"

var findCluster = "6681"
var region = "cn-hangzhou"

var matchKey_masterNum = "集群主节点机器配置"
var matchKey_masterDisk = "集群主节点磁盘配置"
var matchKey_workerNum = "集群从节点机器配置"
var matchKey_workerDisk = "集群从节点磁盘配置"

timedGetText(billlist, 10000, function(data){
	var obj = JSON.parse(data);
	var count = 0;
	for(index in obj.data){
		var bill = obj.data[index]
		// direct get detail
		timedGetText(clusterDetail+"&billId="+bill.billId+"&instanceId="+findCluster, 10000, function(resInfo){
			var resInfoObj = JSON.parse(resInfo).data;
			for(resIndex in resInfoObj){
				var res = resInfoObj[resIndex]
				console.log(res.resCode, res.resQuantity);
			}
			count++;
			console.log("total:", count);
		});
		// for count
//		timedGetText(detail+bill.billId+"&region="+region, 10000, function(detailorder){
//			var orderObj = JSON.parse(detailorder).data;
//			for(oindex in orderObj){
//				if(orderObj[oindex].baseConfigMap.instanceId == findCluster){
//					count++;
//				}
//			}
//			console.log("total:", count)
//		})
	}
})