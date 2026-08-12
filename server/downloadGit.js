const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const targetDir = 'C:\\Users\\indro\\git';
const zipPath = 'C:\\Users\\indro\\MinGit.zip';
const projectPath = 'c:\\Users\\indro\\Desktop\\Skillflow major 1';

const setupGit = () => {
  try {
    console.log('[MinGit] Downloading MinGit package...');
    const downloadCmd = `powershell -Command "Invoke-WebRequest -Uri 'https://github.com/git-for-windows/git/releases/download/v2.45.1.windows.1/MinGit-2.45.1-64-bit.zip' -OutFile '${zipPath}'"`;
    execSync(downloadCmd, { stdio: 'inherit' });

    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    console.log('[MinGit] Extracting using tar...');
    execSync(`tar -xf "${zipPath}" -C "${targetDir}"`, { stdio: 'inherit' });

    const gitExe = path.join(targetDir, 'cmd', 'git.exe');
    if (fs.existsSync(gitExe)) {
      console.log('✅ Git executable successfully ready!');
      console.log('Version:', execSync(`"${gitExe}" --version`).toString().trim());

      // Configure git user name & email for commit
      execSync(`"${gitExe}" config --global user.name "Antigravity Recruiter"`, { stdio: 'inherit' });
      execSync(`"${gitExe}" config --global user.email "recruiter@smarthire.com"`, { stdio: 'inherit' });

      // Initialize Git repo in project
      console.log('[Git] Initializing Git repository in project workspace...');
      execSync(`"${gitExe}" init`, { cwd: projectPath, stdio: 'inherit' });
      execSync(`"${gitExe}" add .`, { cwd: projectPath, stdio: 'inherit' });
      execSync(`"${gitExe}" commit -m "Initial commit: SmartHire ATS MERN Stack Application"`, { cwd: projectPath, stdio: 'inherit' });
      console.log('🎉 GIT REPOSITORY INITIALIZED & INITIAL COMMIT CREATED!');
    }
  } catch (err) {
    console.error('Git Setup Error:', err.message);
  }
};

setupGit();
