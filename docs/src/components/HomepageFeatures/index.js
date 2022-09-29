import React from 'react'
import clsx from 'clsx'
import styles from './styles.module.css'

const FeatureList = [
  {
    title: 'Declarative API',
    Svg: require('@site/static/img/zapp_declarative.svg').default,
    description: (
      <>
        Zapp provides simple, declarative API for building user interfaces inspired by Jetpack
        Compose.
      </>
    ),
  },
  {
    title: 'Focus on the app',
    Svg: require('@site/static/img/zapp_focus.svg').default,
    description: (
      <>Zapp handles most of the Zepp OS's quirks so that you don't have to worry about them.</>
    ),
  },
  {
    title: 'Cohesive UI',
    Svg: require('@site/static/img/zapp_cohesive.svg').default,
    description: (
      <>
        Create a <a href="https://m3.material.io/theme-builder#/custom">Material theme</a> and all
        UI components will follow it.
      </>
    ),
  },
]

function Feature({ Svg, title, description }) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  )
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  )
}
