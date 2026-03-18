import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Privacy Policy | ZorSan Motors',
    description: 'Privacy Policy and data collection guidelines for ZorSan Motors.',
};

export default function PrivacyPolicyPage() {
    return (
        <div className="container max-w-4xl mx-auto py-12 md:py-24 px-4 sm:px-6">
            <h1 className="text-4xl font-extrabold tracking-tight mb-8">Privacy Policy</h1>
            
            <div className="space-y-8 text-muted-foreground leading-relaxed">
                <section>
                    <h2 className="text-2xl font-bold text-foreground mb-4">1. Information We Collect</h2>
                    <p>
                        At ZorSan Motors, we collect information you provide directly to us when you request information, apply for financing, or communicate with us. This personal information (PII) may include your name, email address, phone number, and physical address.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-foreground mb-4">2. How We Use Your Information</h2>
                    <p>
                        We use the information we collect to provide, maintain, and improve our services. This includes communicating with you about your inquiries, sending you informational or marketing SMS messages (if you have opted-in), and fulfilling your vehicle purchase or financing requests.
                    </p>
                </section>

                <section className="bg-muted p-6 rounded-lg border-l-4 border-primary">
                    <h2 className="text-xl font-bold text-foreground mb-2">3. SMS & Personal Data Sharing Policy</h2>
                    <p className="text-foreground font-medium">
                        ZorSan Motors respects your privacy. Customer personal information (PII) and messaging consent data will not be shared, sold, or provided to any third parties for their own marketing purposes.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-foreground mb-4">4. SMS Opt-Out</h2>
                    <p>
                        If you have opted in to receive SMS text messages from us, you can opt out at any time by replying <strong>STOP</strong> to any message you receive from us. For assistance, you can reply <strong>HELP</strong>. Message and data rates may apply.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-foreground mb-4">5. Contact Us</h2>
                    <p>
                        If you have any questions about this Privacy Policy, please contact us at:
                        <br /><br />
                        <strong>ZorSan Motors</strong><br />
                        8 Montello St<br />
                        Brockton, MA 02301<br />
                        Phone: (781) 300-4796<br />
                        Email: sales@zorsanmotors.com
                    </p>
                </section>
            </div>
        </div>
    );
}
