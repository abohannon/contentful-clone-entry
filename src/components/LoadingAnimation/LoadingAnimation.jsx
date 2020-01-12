import React from 'react'
import {
  SkeletonBodyText,
  SkeletonContainer,
  Paragraph,
  Note,
} from '@contentful/forma-36-react-components'

const LoadingAnimation = () => (
  <div>
    <Note style={{ marginBottom: 16 }} noteType="primary">
      Loading... (this may take several seconds)
    </Note>
    <SkeletonContainer
      animate
      width="100%"
      height="100%"
      backgroundColor="#e5ebed"
      foregroundColor="#f7f9fa"
      speed={2}
    >
      <SkeletonBodyText numberOfLines={1} width={128} />
      <SkeletonBodyText
        numberOfLines={1}
        width={128}
        offsetTop={24}
        offsetLeft={24}
      />
      <SkeletonBodyText
        numberOfLines={1}
        width={128}
        offsetTop={48}
        offsetLeft={24}
      />
      <SkeletonBodyText
        numberOfLines={1}
        width={128}
        offsetTop={72}
        offsetLeft={48}
      />
      <SkeletonBodyText numberOfLines={1} width={128} offsetTop={96} />
      <SkeletonBodyText numberOfLines={1} width={128} offsetTop={120} />
    </SkeletonContainer>
  </div>
)

export default LoadingAnimation
