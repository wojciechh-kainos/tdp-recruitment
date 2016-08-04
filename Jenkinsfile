#!groovy

node {
    stage 'checkout'
    checkout scm

    stage 'assemble'
    sh 'gradle assemble'

    stage 'npm install'
    sh 'npm install'

    stage 'bower install'
    sh 'bower install --allow-root'

    stage 'test'
    sh 'gradle test'

    stage 'karma test'
    sh './node_modules/karma/bin/karma start karma.conf.js'

}
