/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from './types/interface';
import { Home } from './view/Home';
import { Page404 } from './view/Page404';

async function router() {
    const routes: Router[] = [
        { path: '/', view: Home },
        { path: '/404', view: Page404 },
    ];

    const potentialMatches = routes.map((route) => ({
        route,
        result: window.location.pathname === route.path,
    }));

    let match = potentialMatches.find((potentialMatch) => potentialMatch.result === true);

    if (!match) {
        match = {
            route: routes[1],
            result: true,
        };
    }

    // eslint-disable-next-line new-cap
    const view = new match.route.view();
    try {
      (document.querySelector('.main') as HTMLElement).innerHTML = await view.getHtml();      
    } catch (error) {
      (document.querySelector('.main') as HTMLElement).innerHTML = 'error';      
    }
}

async function navigateTo(url: string) {
    window.history.pushState(null, '', url);
    await router();
}

window.addEventListener('popstate', router);

document.addEventListener('DOMContentLoaded', () => {
    document.body.addEventListener('click', (e) => {
        if ((<HTMLElement>e.target).matches('[data-link]')) {
            e.preventDefault();
            navigateTo((<HTMLAnchorElement>e.target).href);
        }
    });

    router();
});
