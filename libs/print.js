$(function() {
    // 파일 입력 엘리먼트 가져오기 
    var fileInput = document.getElementById('fileInput');

    // 파일 입력 엘리먼트를 감지하여 변경이 되면 콜백 함수 수행
    fileInput.addEventListener('change', function(e) {
        $("#loading").show();
        handleDrop(e);
    });

    function handleDrop(e) {
        //     e.stopPropagation();
        //       e.preventDefault();
        // 파일 객체 가져오기 
        var files = fileInput.files;
        var i, f;
        for (i = 0; i != files.length; ++i) {
            f = files[i];
            var reader = new FileReader();
            var name = f.name;
            reader.onload = function(e) {
                var data = e.target.result;

                // xls  read 처리 
                // 바이너리 모드로 읽었기 떄문에 type 을 바이너리로 설정한다.
                var workbook = XLSX.read(data, {
                    type: 'binary'
                });

                console.log(workbook);
               var sheet_name_list = workbook.SheetNames;
                // 첫번쨰 시트명을 가져옴
                var sheetName = sheet_name_list[0];
                // 시트명의 데이터를 json으로 반환한다.
                var json = to_json(workbook, sheetName);
                console.dir(json);
                
                var li1 = "";
                var li2 = "";
                var arr;
                // list 배열을 순회하면서 data 정보를 가져옴 
                $.each(json[sheetName], function(k, item) {
                    arr = [];
                    for (var prop in item) {
                        arr.push(item[prop]);
                    }          
                             
                    if(k % 2 == 0){
                        li1 += "<li>" +
                            arr[0] + "<br/>" +
                            arr[1] + "<br/>" +
                            arr[2] + "<br/>" +
                            arr[3] + "</li>";                                
                    }else{
                        li2 += "<li>" +
                            arr[0] + "<br/>" +
                            arr[1] + "<br/>" +
                            arr[2] + "<br/>" +
                            arr[3] + "</li>";                       
                    }                    
                });

                setTimeout(function(){
                    $("#loading").hide();
                    $("#list1").html(li1);
                    $("#list2").html(li2);
                }, 2000);

            };

            // 바이너리로 데이터를 읽어드림 
            reader.readAsBinaryString(f);
        }
    }

    $("#printBtn").on('click', function(){
        window.print();
    });    

    //fileInput.addEventListener('drop', handleDrop, false);

    // 시트 데이터를 json 으로 변환시켜줌
    function to_json(workbook, sheetName) {
        var result = {};
        // workbook.SheetNames.forEach(function(sheetName) {
        var roa = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
        if (roa.length > 0) {
            result[sheetName] = roa;
        }
        //   });
        return result;
    }

});