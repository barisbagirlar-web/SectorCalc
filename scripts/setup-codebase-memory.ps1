$ErrorActionPreference = 'Stop'

$repoRoot = (git rev-parse --show-toplevel).Trim()
if (-not $repoRoot) { throw 'Unable to resolve repository root.' }

if (-not (Get-Command codebase-memory-mcp -ErrorAction SilentlyContinue)) {
    $installer = Join-Path $env:TEMP ("cbm-install-{0}.ps1" -f [guid]::NewGuid().ToString('N'))
    try {
        Invoke-WebRequest -Uri 'https://raw.githubusercontent.com/DeusData/codebase-memory-mcp/main/install.ps1' -OutFile $installer
        Unblock-File $installer -ErrorAction SilentlyContinue
        & powershell -NoProfile -ExecutionPolicy Bypass -File $installer
    }
    finally {
        Remove-Item $installer -Force -ErrorAction SilentlyContinue
    }
}

codebase-memory-mcp config set auto_index true
codebase-memory-mcp config set auto_watch true
codebase-memory-mcp config set auto_index_limit 50000
codebase-memory-mcp cli --progress index_repository --repo-path $repoRoot
codebase-memory-mcp cli list_projects

Write-Output 'Codebase Memory is installed and this repository is indexed.'
Write-Output 'Restart Cursor so the MCP server and managed agent configuration are loaded.'
