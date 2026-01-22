export default function SettingsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground">Manage your admin profile and site configurations.</p>
            </div>

            <div className="grid gap-6">
                <div className="p-6 border rounded-lg bg-card">
                    <h2 className="text-xl font-semibold mb-4">General Information</h2>
                    <p className="text-sm text-muted-foreground mb-4">
                        Update the contact information displayed on the website.
                    </p>
                    {/* Placeholder for future form */}
                    <div className="grid gap-4 max-w-xl opacity-50 pointer-events-none">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Site Name</label>
                            <input type="text" className="w-full p-2 rounded border bg-muted" value="Zorsan Motors" readOnly />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Contact Email</label>
                            <input type="text" className="w-full p-2 rounded border bg-muted" value="info@zorsanmotors.com" readOnly />
                        </div>
                    </div>
                </div>

                <div className="p-6 border rounded-lg bg-card">
                    <h2 className="text-xl font-semibold mb-4">Admin Security</h2>
                    <p className="text-sm text-muted-foreground mb-4">
                        Change your administrator password.
                    </p>
                    <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded text-yellow-600 dark:text-yellow-400 text-sm">
                        Password management is currently handled via environment variables (`ADMIN_PASSWORD`).
                        Please contact your developer to rotate credentials.
                    </div>
                </div>
            </div>
        </div>
    );
}
