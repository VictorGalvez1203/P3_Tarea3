window.addEventListener("DOMContentLoaded", event => {
    let currentPage = 1;
    let totalPages = 1;
    let totalComments = 0;
    let isCommentsVisible = false;
    
    const commentsList = document.getElementById('commentsList');
    const toggleCommentsBtn = document.getElementById('commentCount');
    const commentsContainer = document.querySelector('.text-center.comentario');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const commentsHeader = commentsContainer.querySelector('h4');
    const commentNavegacion = document.getElementById('commentnavegacion');

    commentsContainer.style.display = 'none';
    if (toggleCommentsBtn) {
        toggleCommentsBtn.style.display = 'none';
    }
    if (commentNavegacion) {
        commentNavegacion.style.display = 'none';
        commentNavegacion.style.visibility = 'hidden';
        commentNavegacion.style.opacity = '0';
        commentNavegacion.style.position = 'absolute';
        commentNavegacion.style.width = '0';
        commentNavegacion.style.height = '0';
        commentNavegacion.style.overflow = 'hidden';
    }
    
    if (toggleCommentsBtn) {
        toggleCommentsBtn.addEventListener('click', (e) => {
            e.preventDefault();
            isCommentsVisible = !isCommentsVisible;
            
            commentsList.style.display = isCommentsVisible ? 'block' : 'none';
            if (commentsHeader) commentsHeader.style.display = isCommentsVisible ? 'block' : 'none';
            
            if (commentNavegacion) {
                if (isCommentsVisible) {
                    commentNavegacion.style.display = totalPages > 1 ? 'flex' : 'none';
                    commentNavegacion.style.visibility = 'visible';
                    commentNavegacion.style.opacity = '1';
                    commentNavegacion.style.position = 'static';
                    commentNavegacion.style.width = 'auto';
                    commentNavegacion.style.height = 'auto';
                    commentNavegacion.style.overflow = 'visible';
                } else {
                    commentNavegacion.style.display = 'none';
                    commentNavegacion.style.visibility = 'hidden';
                    commentNavegacion.style.opacity = '0';
                }
            }
            
            toggleCommentsBtn.textContent = isCommentsVisible 
                ? `Ocultar ${totalComments} comentario${totalComments !== 1 ? 's' : ''}` 
                : `Mostrar ${totalComments} comentario${totalComments !== 1 ? 's' : ''}`;
        });
    }
    
    function loadComments(page) {
        fetch(`components/get_comentario.php?page=${page}`)
            .then(response => {
                if (!response.ok) throw response;
                return response.json();
            })
            .then(data => {
                if (!data || !data.pagination || !data.comentarios || data.comentarios.length === 0) {
                    commentsContainer.style.display = 'none';
                    if (toggleCommentsBtn) toggleCommentsBtn.style.display = 'none';
                    isCommentsVisible = false;
                    return;
                }
    
                currentPage = data.pagination.currentPage;
                totalPages = data.pagination.totalPages;
                totalComments = data.pagination.total;
                
                commentsContainer.style.display = 'block';
                if (toggleCommentsBtn) {
                    toggleCommentsBtn.style.display = 'inline-block';
                    toggleCommentsBtn.textContent = isCommentsVisible 
                        ? `Ocultar ${totalComments} comentario${totalComments !== 1 ? 's' : ''}` 
                        : `Mostrar ${totalComments} comentario${totalComments !== 1 ? 's' : ''}`;
                    toggleCommentsBtn.classList.add('btn', 'btn-link');
                }
    
                commentsList.style.display = isCommentsVisible ? 'block' : 'none';
                if (commentsHeader) commentsHeader.style.display = isCommentsVisible ? 'block' : 'none';
                
                if (commentNavegacion) {
                    if (isCommentsVisible) {
                        commentNavegacion.style.display = totalPages > 1 ? 'flex' : 'none';
                        commentNavegacion.style.visibility = 'visible';
                        commentNavegacion.style.opacity = '1';
                        commentNavegacion.style.position = 'static';
                        commentNavegacion.style.width = 'auto';
                        commentNavegacion.style.height = 'auto';
                        commentNavegacion.style.overflow = 'visible';
                    } else {
                        commentNavegacion.style.display = 'none';
                        commentNavegacion.style.visibility = 'hidden';
                        commentNavegacion.style.opacity = '0';
                    }
                }
    
                commentsList.innerHTML = '';
                data.comentarios.forEach(comentario => {
                    const card = document.createElement("div");
                    card.className = "comment-card mb-3 p-3 border rounded position-relative";
                    card.innerHTML = `
                        <h5 class="fw-bold">${comentario.nombre}</h5>
                        <p class="mb-2">${comentario.comentario}</p>
                        <small class="text-muted d-block mb-2">${formatDate(comentario.fecha)}</small>
                        <div class="comment-actions">
                            <button class="btn btn-sm btn-outline-primary edit-comment me-2" data-id="${comentario.id}">
                                <i class="fas fa-edit"></i> Editar
                            </button>
                            <button class="btn btn-sm btn-outline-danger delete-comment" data-id="${comentario.id}">
                                <i class="fas fa-trash"></i> Eliminar
                            </button>
                        </div>
                    `;
                    commentsList.appendChild(card);
                });

                document.querySelectorAll('.delete-comment').forEach(button => {
                    button.addEventListener('click', function() {
                        const commentId = this.getAttribute('data-id');
                        if (confirm('¿Estás seguro de que quieres eliminar este comentario?')) {
                            deleteComment(commentId);
                        }
                    });
                });
    
                document.querySelectorAll('.edit-comment').forEach(button => {
                    button.addEventListener('click', function() {
                        const commentId = this.getAttribute('data-id');
                        editComment(commentId);
                    });
                });
    
                if (prevBtn) prevBtn.disabled = currentPage <= 1;
                if (nextBtn) nextBtn.disabled = currentPage >= totalPages;
            })
            .catch(error => {
                console.error('Error al cargar comentarios:', error);
                commentsContainer.style.display = 'none';
                if (toggleCommentsBtn) toggleCommentsBtn.style.display = 'none';
                isCommentsVisible = false;
            });
    }

function deleteComment(commentId) {
    const authorName = localStorage.getItem("commentAuthorName");
    
    fetch(`components/delete_comentario.php?id=${commentId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'X-Author-Name': authorName || ''
        },
        body: JSON.stringify({id: commentId})
    })
    .then(response => {
        if (!response.ok) throw response;
        return response.json();
    })
    .then(data => {
        if (data.success) {
            alert('Comentario eliminado correctamente');
            loadComments(currentPage);
        } else {
            alert(data.message || 'Error al eliminar el comentario');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        error.json().then(errData => {
            alert(errData.message || 'Error al eliminar el comentario');
        });
    });
}

function editComment(commentId) {
    const commentCard = document.querySelector(`.edit-comment[data-id="${commentId}"]`).closest('.comment-card');
    const currentText = commentCard.querySelector('p').textContent;
    const actionsDiv = commentCard.querySelector('.comment-actions');
    
    const originalActions = actionsDiv.innerHTML;
    actionsDiv.style.display = 'none';
    
    commentCard.querySelector('p').outerHTML = `
        <textarea class="form-control mb-2">${currentText}</textarea>
        <div class="edit-actions">
            <button class="btn btn-sm btn-success save-edit me-2" data-id="${commentId}">
                <i class="fas fa-save"></i> Guardar
            </button>
            <button class="btn btn-sm btn-secondary cancel-edit" data-id="${commentId}">
                <i class="fas fa-times"></i> Cancelar
            </button>
        </div>
    `;
    
    commentCard.querySelector('.save-edit').addEventListener('click', function() {
        const newText = commentCard.querySelector('textarea').value;
        saveCommentEdit(commentId, newText);
    });
    
    commentCard.querySelector('.cancel-edit').addEventListener('click', function() {
        commentCard.querySelector('textarea').outerHTML = `<p class="mb-2">${currentText}</p>`;
        actionsDiv.style.display = 'block';
        commentCard.querySelector('.edit-actions').remove();
    });
}
function saveCommentEdit(commentId, newText) {
    const authorName = localStorage.getItem("commentAuthorName");
    
    fetch(`components/update_comentario.php`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Author-Name': authorName || ''
        },
        body: JSON.stringify({
            id: commentId,
            comentario: newText
        })
    })
    .then(response => {
        if (!response.ok) throw response;
        return response.json();
    })
    .then(data => {
        if (data.success) {
            alert('Comentario actualizado correctamente');
            loadComments(currentPage);
        } else {
            alert(data.message || 'Error al actualizar el comentario');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        error.json().then(errData => {
            alert(errData.message || 'Error al actualizar el comentario');
        });
    });
}
    function formatDate(dateString) {
        const date = new Date(dateString);
        
        if (isNaN(date.getTime())) {
            console.error('Fecha inválida:', dateString);
            return 'Fecha desconocida';
        }
        
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'America/Santo_Domingo'
        };
        
        return date.toLocaleDateString('es-ES', options);
    }

    prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            loadComments(currentPage - 1);
        }
    });
    
    nextBtn.addEventListener('click', () => {
        if (currentPage < totalPages) {
            loadComments(currentPage + 1);
        }
    });

    loadComments(1);
    
const contactForm = document.getElementById("contactForm");
if (contactForm) {
    contactForm.addEventListener("submit", async function(e) {
        e.preventDefault();
        
        const submitButton = this.querySelector('[type="submit"]');
        const originalText = submitButton.textContent;
        const authorName = this.querySelector("#name").value;
        
        // Guardar el nombre del autor en localStorage y en una cookie
        localStorage.setItem("commentAuthorName", authorName);
        document.cookie = `commentAuthorName=${encodeURIComponent(authorName)}; path=/; max-age=${60*60*24*30}`; // 30 días
        
        submitButton.disabled = true;
        submitButton.textContent = "Enviando...";
        
        try {
            const formData = new FormData(this);
            const response = await fetch(this.action, {
                method: "POST",
                body: formData,
                headers: { 'Accept': 'application/json' }
            });
            
            if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
            
            const data = await response.json();
            alert(data.message);
            
            if (data.success) {
                this.reset();
                loadComments(1);
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Error al enviar el comentario");
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = originalText;
        }
    });
}
});
