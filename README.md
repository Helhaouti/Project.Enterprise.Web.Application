# README

## Website
[Click here for to go to the website](https://ewa-fe.herokuapp.com)

## UML System documentation
[Click here for UML System documentation](EWA_Technical_documentation.pdf)

## Development environment setup
Follow the following steps to configure a development environment.

### Back-end
1. Load all maven dependencies.
2. Run the application with vm-option: -Dspring.profiles.active=dev

### Front-end

1. Navigate to the workspace folder, in our case front-end.
2. (optional) On Windows client computers, the execution of PowerShell scripts is disabled by default. To allow the execution of PowerShell scripts, which is needed for npm global binaries, you must set the following: `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned`
3. Then run: `npm install`, to install all dependencies of our application.
4. Then run: `ng serve`. to build and launch a development server, accessible from `localhost:4200`.
