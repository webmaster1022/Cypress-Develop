import { oneLine } from 'common-tags'
import { getRunnerInjectionContents, getRunnerCrossOriginInjectionContents } from '@packages/resolve-dist'

export function partial (domain) {
  return oneLine`
    <script type='text/javascript'>
      document.domain = '${domain}';
    </script>
  `
}

export function full (domain) {
  return getRunnerInjectionContents().then((contents) => {
    return oneLine`
      <script type='text/javascript'>
        document.domain = '${domain}';

        ${contents}
      </script>
    `
  })
}

export function fullCrossOrigin (domain) {
  return getRunnerCrossOriginInjectionContents().then((contents) => {
    return oneLine`
      <script type='text/javascript'>
        document.domain = '${domain}';

        ${contents}
      </script>
    `
  })
}
