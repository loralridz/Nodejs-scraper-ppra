function getDate(date) {

    const pieces = (date.replace(/(\r\n|\n|\r)/gm, " ")).split(" ");

    const r = pieces[0].split("/");
    const rm = [r[1], r[0], r[2]];

    var str2 = replaceAll(rm.toString(), ",", "-");
    if (pieces.length == 1) {
        return str2;
    } else {
        return (str2 + " " + pieces[1].toString() + " " + pieces[2]);
    }

}