// initializeIcons() should only be called once per app and must be called before rendering any components.
import { initializeIcons } from '@fluentui/react/lib/Icons';
initializeIcons();

import { loadSettings } from '../../utils/settings';
import { inject2Perceptor, Perceptor } from './Perceptor';

import DeveloperActiInflTrend from './DeveloperActiInflTrend';
import RepoActiInflTrend from './RepoActiInflTrend';
import PerceptorTab from './PerceptorTab';
import PerceptorLayout from './PerceptorLayout';
import DeveloperNetwork from './DeveloperNetwork';
import ProjectNetwork from './ProjectNetwork';
import Hypertrons from './Hypertrons';

import './content.styles.css';

// inject to Perceptor's static variable
inject2Perceptor(DeveloperActiInflTrend);
inject2Perceptor(RepoActiInflTrend);
inject2Perceptor(PerceptorTab);
inject2Perceptor(PerceptorLayout);
inject2Perceptor(DeveloperNetwork);
inject2Perceptor(ProjectNetwork);
inject2Perceptor(Hypertrons);

async function mainInject() {
  const settings = await loadSettings();
  if (settings.isEnabled) {
    const perceptor = new Perceptor();
    perceptor.run();
  }
}

document.addEventListener('turbo:load', () => {
  mainInject();
});

/**
 * I infer that GitHub uses hotwired/turbo to speedup its SPA.
 * Fortunately there are some events to hook our code in GitHub
 * life cycle. See: https://turbo.hotwired.dev/reference/events
 *
 * FluentUI is a css-in-js UI library, all styles are dynamicly
 * computed and injected to several style tags, like:
 *
 * <head>
 *   <style data-merge-styles="true"></style>
 *   <style data-merge-styles="true"></style>
 *   <style data-merge-styles="true"></style>
 * </head>
 *
 * Thease tags are only computed once for each component. But the
 * style tags are regarded as "provisional elements" by turbo and
 * most of them will be removed after each trubo:visit, leading to
 * style crash.
 *
 * After reading the source code of turbo, I figure out a workaround.
 * By adding an id to all <style data-merge-styles="true"></style>
 * to make their outerHtml not be same, turbo will not regard them
 * as provisional elements and will keep them in headers.
 */

document.addEventListener('turbo:before-visit', () => {
  [...document.getElementsByTagName('style')].forEach((element, index) => {
    if (element.hasAttribute('data-merge-styles')) {
      element.setAttribute('data-id', index + '');
    }
  });
});
