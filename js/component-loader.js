// Component loader utility
export async function loadComponent(componentPath) {
  try {
    const response = await fetch(componentPath);
    return await response.text();
  } catch (error) {
    console.error(`Failed to load component: ${componentPath}`, error);
    return '';
  }
}

export async function loadAllComponents() {
  const [setupPage, gameScreen, modals] = await Promise.all([
    loadComponent('components/setup-page.html'),
    loadComponent('components/game-screen.html'),
    loadComponent('components/modals.html')
  ]);

  document.body.insertAdjacentHTML('afterbegin', setupPage);
  document.body.insertAdjacentHTML('beforeend', gameScreen);
  document.body.insertAdjacentHTML('beforeend', modals);
}