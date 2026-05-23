# merge-component-folders.ps1
# Use this only if move-components-to-pages.ps1 skipped folders
# because destination folders already existed.

$ErrorActionPreference = "Stop"

function Ensure-Dir {
    param ([string] $Path)

    if (-not (Test-Path $Path)) {
        New-Item -ItemType Directory -Path $Path | Out-Null
    }
}

function Merge-FolderSafe {
    param (
        [string] $Source,
        [string] $Destination
    )

    if (-not (Test-Path $Source)) {
        return
    }

    Ensure-Dir $Destination

    Get-ChildItem -Path $Source -Force | ForEach-Object {
        $target = Join-Path $Destination $_.Name

        if (Test-Path $target) {
            Write-Warning "Skipped existing item: $target"
        }
        else {
            Move-Item -Path $_.FullName -Destination $target
            Write-Host "Moved: $($_.FullName) -> $target"
        }
    }

    $remainingItems = Get-ChildItem -Path $Source -Force

    if ($remainingItems.Count -eq 0) {
        Remove-Item -Path $Source -Force
        Write-Host "Removed empty folder: $Source"
    }
}

# Layout
Merge-FolderSafe "src/app/components/admin/admin-layout" "src/app/core/layout/admin-wrapper"
Merge-FolderSafe "src/app/components/admin/admin-wrapper" "src/app/core/layout/admin-wrapper"
Merge-FolderSafe "src/app/components/admin-layout" "src/app/core/layout/admin-wrapper"
Merge-FolderSafe "src/app/components/admin-wrapper" "src/app/core/layout/admin-wrapper"

# Auth
Merge-FolderSafe "src/app/components/login" "src/app/features/auth/pages/login"
Merge-FolderSafe "src/app/components/auth/login" "src/app/features/auth/pages/login"

# Users
Merge-FolderSafe "src/app/components/user" "src/app/features/users/pages/user-profile"
Merge-FolderSafe "src/app/components/users" "src/app/features/users/pages/user-profile"
Merge-FolderSafe "src/app/components/profile" "src/app/features/users/pages/user-profile"
Merge-FolderSafe "src/app/components/user-profile" "src/app/features/users/pages/user-profile"
Merge-FolderSafe "src/app/components/auth/user" "src/app/features/users/pages/user-profile"

# Authors
Merge-FolderSafe "src/app/components/author" "src/app/features/authors/pages/author-list"
Merge-FolderSafe "src/app/components/authors" "src/app/features/authors/pages/author-list"
Merge-FolderSafe "src/app/components/author-list" "src/app/features/authors/pages/author-list"
Merge-FolderSafe "src/app/components/authors-list" "src/app/features/authors/pages/author-list"

Merge-FolderSafe "src/app/components/author-detail" "src/app/features/authors/pages/author-detail"
Merge-FolderSafe "src/app/components/authors-detail" "src/app/features/authors/pages/author-detail"

# Pasodobles
Merge-FolderSafe "src/app/components/pasodoble" "src/app/features/pasodobles/pages/pasodoble-list"
Merge-FolderSafe "src/app/components/pasodobles" "src/app/features/pasodobles/pages/pasodoble-list"
Merge-FolderSafe "src/app/components/pasodoble-list" "src/app/features/pasodobles/pages/pasodoble-list"
Merge-FolderSafe "src/app/components/pasodobles-list" "src/app/features/pasodobles/pages/pasodoble-list"

Merge-FolderSafe "src/app/components/pasodoble-detail" "src/app/features/pasodobles/pages/pasodoble-detail"
Merge-FolderSafe "src/app/components/pasodobles-detail" "src/app/features/pasodobles/pages/pasodoble-detail"

# Admin
Merge-FolderSafe "src/app/components/admin/dashboard" "src/app/features/admin/pages/dashboard"
Merge-FolderSafe "src/app/components/admin-dashboard" "src/app/features/admin/pages/dashboard"

Merge-FolderSafe "src/app/components/admin/pasodobles" "src/app/features/admin/pasodobles/pages/admin-pasodoble-list"
Merge-FolderSafe "src/app/components/admin/pasodoble-list" "src/app/features/admin/pasodobles/pages/admin-pasodoble-list"
Merge-FolderSafe "src/app/components/admin/admin-pasodoble-list" "src/app/features/admin/pasodobles/pages/admin-pasodoble-list"

Merge-FolderSafe "src/app/components/admin/pasodoble-form" "src/app/features/admin/pasodobles/pages/admin-pasodoble-form"
Merge-FolderSafe "src/app/components/admin/admin-pasodoble-form" "src/app/features/admin/pasodobles/pages/admin-pasodoble-form"
Merge-FolderSafe "src/app/components/admin/pasodobles-form" "src/app/features/admin/pasodobles/pages/admin-pasodoble-form"

Write-Host ""
Write-Host "Merge finished."
Write-Host "Now check src/app/components for leftovers."
Write-Host ""