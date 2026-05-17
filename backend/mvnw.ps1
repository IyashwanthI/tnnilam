# Maven Wrapper for PowerShell
$MAVEN_PROJECTBASEDIR = $PSScriptRoot
$WRAPPER_JAR = "$MAVEN_PROJECTBASEDIR\.mvn\wrapper\maven-wrapper.jar"

& java "-Dmaven.multiModuleProjectDirectory=$MAVEN_PROJECTBASEDIR" -cp "$WRAPPER_JAR" org.apache.maven.wrapper.MavenWrapperMain @args
exit $LASTEXITCODE
