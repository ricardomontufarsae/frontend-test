app.factory('UtilService', function($q, $http) {
    return {
        imprimirTabla: function (elementId, titulo) {
            var contenido = document.getElementById(elementId).outerHTML;
            var ventana = window.open('', '', 'height=700,width=900');
            ventana.document.write('<html><head><title>' + titulo + '</title>');
            ventana.document.write('<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">');
            ventana.document.write('</head><body>');
            ventana.document.write('<h3 class="text-center mt-3 mb-4">' + titulo + '</h3>');
            ventana.document.write(contenido);
            ventana.document.write('</body></html>');
            ventana.document.close();
            ventana.focus();
            ventana.print();
            ventana.close();
        },

        exportarAExcel: function (datos, nombreArchivo, nombreHoja) {
            const hoja = XLSX.utils.json_to_sheet(datos);
            const libro = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(libro, hoja, nombreHoja);
            XLSX.writeFile(libro, nombreArchivo + ".xlsx");
        }


    }
})