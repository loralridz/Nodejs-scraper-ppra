

function myCreateFunction() {
    var table = document.getElementById("mytable");
    var row = table.insertRow();
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);
    var cell5 = row.insertCell(4);

    var no11 = document.querySelector("#no1 > input[type=number]")
        .value;
    cell1.innerHTML = no11;

    var details11 = document.querySelector(
        "#details1 > input[type=text]"
    ).value;
    cell2.innerHTML = details11;

    var advertise11 = document.querySelector(
        "#advertised1 > input[type= date]"
    ).value;
    cell3.innerHTML = advertise11;

    var closing11 = document.querySelector(
        "#closing1 > input[type= date]"
    ).value;
    cell4.innerHTML = closing11;

    var document11 = document.querySelector(
        "#document1 > input[type=text]"
    ).value;
    cell5.innerHTML = document11;
}



function myFunction() {
    document.getElementById("myForm").reset();
}



        //on scrolling down 20px, show the button
        window.onscroll = function () {
            scrollFunction();
        };

        function scrollFunction() {
            if (
                document.body.scrollTop > 20 ||
                document.documentElement.scrollTop > 20
            ) {
                document.getElementById("myBtn").style.display = "block";
            } else {
                document.getElementById("myBtn").style.display = "none";
            }
        }

        // When the user clicks on the button, scroll to the top of the document
        function topFunction() {
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
        }
  