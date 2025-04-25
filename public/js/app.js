// Load initial form data when page loads
window.addEventListener('DOMContentLoaded', () => {
    const avaliacaoData = JSON.parse(localStorage.getItem('avaliacaoData'));
    if (!avaliacaoData) {
        window.location.href = 'index.html';
        return;
    }

    // Display initial form data
    const serverDataDiv = document.getElementById('serverData');
    serverDataDiv.innerHTML = `
        <p><strong>Nome:</strong> ${avaliacaoData.nome}</p>
        <p><strong>Matrícula:</strong> ${avaliacaoData.matricula}</p>
        <p><strong>Órgão:</strong> ${avaliacaoData.orgao}</p>
        <p><strong>Setor:</strong> ${avaliacaoData.setor}</p>
        <p><strong>Cargo:</strong> ${avaliacaoData.cargo}</p>
        <p><strong>Período:</strong> ${formatDate(avaliacaoData.periodoDe)} a ${formatDate(avaliacaoData.periodoAte)}</p>
        <p><strong>Avaliação:</strong> ${avaliacaoData.parcial.map(p => p + 'ª').join(', ')}</p>
    `;

    // Pre-fill avaliado fields
    document.querySelector('input[name="avaliado_nome"]').value = avaliacaoData.nome;
    document.querySelector('input[name="avaliado_matricula"]').value = avaliacaoData.matricula;

    // Add change event listeners to all radio buttons for real-time calculation
    const radioButtons = document.querySelectorAll('input[type="radio"]');
    radioButtons.forEach(radio => {
        radio.addEventListener('change', calculateTotalAndGrade);
    });
});

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
}

function calculateTotalAndGrade() {
    const form = document.getElementById('evaluationForm');
    const criteria = ['interesse', 'produtividade', 'eficiencia', 'iniciativa', 
                    'assiduidade', 'pontualidade', 'adm_tempo', 'relacionamento', 'interacao'];
    
    let total = 0;
    criteria.forEach(criterion => {
        const selected = form.querySelector(`input[name="${criterion}"]:checked`);
        if (selected) {
            total += parseInt(selected.value);
        }
    });

    // Update total points display
    document.getElementById('totalPoints').textContent = total;

    // Determine and display grade
    let grade = '-';
    if (total >= 85) grade = 'EXCELENTE';
    else if (total >= 55) grade = 'BOM';
    else if (total >= 25) grade = 'REGULAR';
    else if (total > 0) grade = 'INSATISFATÓRIO';

    document.getElementById('finalGrade').textContent = grade;
    return { total, grade };
}

function handleEvaluationSubmit(event) {
    event.preventDefault();
    
    // Calculate final total and grade
    const { total, grade } = calculateTotalAndGrade();
    
    // Get all form data
    const formData = new FormData(event.target);
    const evaluationData = Object.fromEntries(formData.entries());
    
    // Add total points and grade
    evaluationData.totalPoints = total;
    evaluationData.finalGrade = grade;
    
    // Combine with initial data
    const avaliacaoData = JSON.parse(localStorage.getItem('avaliacaoData'));
    const completeData = {
        ...avaliacaoData,
        ...evaluationData
    };

    // Here you would typically send the data to a server
    console.log('Complete evaluation data:', completeData);
    
    // For demo purposes, show success message and redirect
    alert('Avaliação enviada com sucesso!');
    localStorage.removeItem('avaliacaoData'); // Clear stored data
    window.location.href = 'index.html';
}