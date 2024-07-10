document.addEventListener('DOMContentLoaded', function() {
    const downloadBtn = document.getElementById('downloadBtn');
    const wikiBtn = document.getElementById('wikiBtn');
    const addonBtn = document.getElementById('addonBtn');
    const moduleCategories = document.getElementById('moduleCategories');
    const teamMembers = document.getElementById('teamMembers');
    const modal = document.getElementById('customModal');
    const closeBtn = modal.querySelector('.close-btn');

    downloadBtn.addEventListener('click', function() {
        modal.style.display = 'block';
        setTimeout(() => {
            modal.classList.add('fade-out');
            setTimeout(() => {
                modal.style.display = 'none';
                modal.classList.remove('fade-out');
            }, 500);
        }, 2000);
    });

    wikiBtn.addEventListener('click', function() {
        window.open(`https://github.com/ZenDevelopement/zen-client/wiki`);
    });

    addonBtn.addEventListener('click', function() {
        window.location.href = 'https://github.com/ZenDevelopement/zen/addons';
    });    

    closeBtn.addEventListener('click', function() {
        modal.classList.add('fade-out');
        setTimeout(() => {
            modal.style.display = 'none';
            modal.classList.remove('fade-out');
        }, 500);
    });

    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.classList.add('fade-out');
            setTimeout(() => {
                modal.style.display = 'none';
                modal.classList.remove('fade-out');
            }, 500);
        }
    });

    let implementedCount = 0;
    let totalCount = 0;

    fetch('data/modules.json')
        .then(response => response.json())
        .then(categories => {
            for (const [category, modules] of Object.entries(categories)) {
                const categoryElement = document.createElement('div');
                categoryElement.className = 'category';
                
                if (category === 'Combat') {
                    categoryElement.classList.add('disabled');
                }
                
                categoryElement.innerHTML = `
                    <div class="category-header">
                        <h3>${category}</h3>
                        <span>▼</span>
                    </div>
                    <div class="category-content"></div>
                `;

                modules.forEach(module => {
                    if (category !== 'Combat') {
                        totalCount++;
                        if (module.implemented) {
                            implementedCount++;
                        }
                    }

                    const moduleElement = document.createElement('div');
                    moduleElement.className = `module ${module.implemented ? 'implemented' : 'planned'}`;
                    moduleElement.setAttribute('data-tooltip', module.tooltip);
                    
                    // Use textContent for proper HTML entity rendering
                    const nameElement = document.createElement('span');
                    nameElement.textContent = module.name;
                    moduleElement.appendChild(nameElement);

                    moduleElement.addEventListener('click', () => {
                        if (module.implemented) {
                            const formattedModuleName = module.name.replace(/\s+/g, '');
                            window.open(`https://github.com/ZenDevelopement/zen-client/wiki/${formattedModuleName}`);
                        }
                    });

                    moduleElement.addEventListener('mouseover', (e) => {
                        const tooltipText = moduleElement.getAttribute('data-tooltip');
                        if (tooltipText) {
                            let tooltip = document.createElement('div');
                            tooltip.className = 'custom-tooltip';
                            tooltip.innerText = tooltipText;
                            document.body.appendChild(tooltip);
                            tooltip.style.left = `${e.pageX + 10}px`;
                            tooltip.style.top = `${e.pageY + 10}px`;
                            moduleElement._tooltip = tooltip;
                        }
                    });

                    moduleElement.addEventListener('mousemove', (e) => {
                        if (moduleElement._tooltip) {
                            moduleElement._tooltip.style.left = `${e.pageX + 10}px`;
                            moduleElement._tooltip.style.top = `${e.pageY + 10}px`;
                        }
                    });

                    moduleElement.addEventListener('mouseout', () => {
                        if (moduleElement._tooltip) {
                            document.body.removeChild(moduleElement._tooltip);
                            moduleElement._tooltip = null;
                        }
                    });

                    categoryElement.querySelector('.category-content').appendChild(moduleElement);  
                });

                moduleCategories.appendChild(categoryElement);

                const header = categoryElement.querySelector('.category-header');
                header.addEventListener('click', () => {
                    if (!categoryElement.classList.contains('disabled')) {
                        categoryElement.classList.toggle('active');
                        header.querySelector('span').textContent = categoryElement.classList.contains('active') ? '▲' : '▼';
                    }
                });
            }

            // Update the module counter
            const moduleCounter = document.getElementById('moduleCounter');
            moduleCounter.textContent = `${implementedCount}/${totalCount}`;
        })
        .catch(error => console.error('Error loading modules:', error));

    fetch('data/team.json')
        .then(response => response.json())
        .then(team => {
            team.forEach(member => {
                const memberElement = document.createElement('div');
                memberElement.className = 'team-member';
                memberElement.innerHTML = `
                    <img src="${member.avatar}" alt="${member.name}" title="View GitHub Profile">
                    <h3>${member.name}</h3>
                    <p>${member.role}</p>
                `;
                memberElement.querySelector('img').addEventListener('click', () => {
                    window.open(member.github);
                });
                teamMembers.appendChild(memberElement);
            });
        })
        .catch(error => console.error('Error loading team data:', error));
});