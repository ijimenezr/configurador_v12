const pantalla_generadorInformes = '<div id="pantalla_generadorInformes">' +
      '<button type="button" class="close" data-dismiss="modal" aria-label="Cerrar ventana"><span aria-hidden="true">×</span></button>' +
      '<div id="menu_generador">' +
            '<h2>Generador de informes</h2>' +
            '<ul>' +
                  '<li><a class="active" href="index.php?pag=apac" id="apac">Actividades y aplicaciones</a></li>' +
                  '<li style="pointer-events: none"><a href="index.php?pag=te" id="te">Tareas de evaluación</a></li>' +
            '</ul>' +
      '</div>' +
      '<div id="principal_generador">' +
            '<div class="heading">' +
                  '<h2>Actividades y aplicaciones</h2>' +
                  '<p class="info">Generador de informes de aplicaciones prácticas y actividades colaborativas, actividad práctica y actividades.</p>' +
            '</div>' +
            '<section class="content">' +
                  '<section class="seleccionar">' +
                        '<button class="btn btn-outline" id="buttonLoadCurso_informe"><i class="fas fa-folder"></i><span> Seleccionar la carpeta del curso</span></button>' +
                        '<button class="btn btn-outline" id="solucionar_informe" disabled><i class="fas fa-file-code"></i><span> Solucionario</span></button>' +
                        '<input type="file" id="inputLoadCurso_informe" ref="inputFileCurso" accept=".html"  webkitdirectory directory multiple>' +
                  '</section>' +
                  '<section class="datos-curso">' +
                        '<button class="btn generadores" id="generarPDF" disabled><i class="fas fa-file-pdf"></i> PDF</button>' +
                        '<button class="btn generadores" id="generarDoc"><i class="fas fa-file-word"></i> DOC</button>' +
                        '<h3 class="titulo" style="margin-top: 0.5rem"></h3>' +
                        '<div class="content-badge" id="cont_acap">' +
                              '<span class="badge ap">0 Aplicación práctica</span>' +
                              '<span class="badge ac">0 Actividad colaborativa</span>' +
                              '<span class="badge actp">0 Actividad práctica</span>' +
                              '<span class="badge act">0 Actividades</span>' +
                              '<span class="badge cdu">0 Caso de uso</span>' +
                        '</div>' +
                        '<div class="content-badge" id="cont_te" style="display: none">' +
                              '<span class="badge te">0 Tarea de evaluación</span>' +
                        '</div>' +
                  '</section>' +
                  '<section class="informe" id="informe"></section>' +
            '</section>' +
      '</div>' +
'</div>'

const informeFinalCurso = '<div id="descargar_infoCurso">' +
      '<div class="numTest"></div>' +
      '<div class="info_glosaBiblio"></div>'+ 
      '<div class="unidades"></div>' +
      '<div class="biblio"></div>' +
      '<div class="glosa"></div>' +
'</div>'

const pantallaEditarGlosario = '<div id="editar_glosario" class="pantallaEmergente">' +
      '<div>'+ 
            '<div class="titulo">' +
                  '<h2>Editar</h2>' +
                  '<button type="button" class="close" data-dismiss="modal" aria-label="Cerrar ventana"><span aria-hidden="true">×</span></button>' +
            '</div>' +
            '<div class="editContenido">' +
                  // '<textarea style="resize: none; width: 100%;" rows="20"></textarea>' +
                  '<div class="form-group editar_glosario">' +
                        '<div class="summernote form-control" id="summernote-content_editar_glosario"></div>' +
                        '<textarea style="display: none;" required data-editor="editor"></textarea>' +
                  '</div>' +
            '</div>' +
            '<button id="b_editarTextarea" class="btn btn-primary">Guardar</button>' +
      '</div>' +
'</div>'