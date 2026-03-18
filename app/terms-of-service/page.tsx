import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Terms of Service | ZorSan Motors',
    description: 'Terms of Service and SMS usage policies for ZorSan Motors.',
};

export default function TermsOfServicePage() {
    return (
        <div className="container max-w-4xl mx-auto py-12 md:py-24 px-4 sm:px-6">
            <h1 className="text-4xl font-extrabold tracking-tight mb-8">Terms of Service</h1>
            
            <div className="space-y-8 text-muted-foreground leading-relaxed">
                <section>
                    <h2 className="text-2xl font-bold text-foreground mb-4">1. Agreement to Terms</h2>
                    <p>
                        By accessing our website and utilizing our services, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, then you may not access our services at ZorSan Motors.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-foreground mb-4">2. Vehicle Information</h2>
                    <p>
                        While we make every effort to ensure the accuracy of the information provided on our website, errors may occur. We reserve the right to correct any pricing, typographical, or photographic errors without prior notice. Mileage and vehicle availability are subject to change.
                    </p>
                </section>

                <section className="bg-muted p-6 rounded-lg border">
                    <h2 className="text-2xl font-bold text-foreground mb-4">3. SMS & Text Messaging Terms</h2>
                    <p className="mb-4">
                        By consenting to receive SMS/Text messages from ZorSan Motors, you acknowledge and agree to the following terms:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Consent:</strong> You authorize ZorSan Motors to send you informational and marketing text messages using an automatic telephone dialing system to the mobile number you provided.</li>
                        <li><strong>Message and Data Rates:</strong> Message and data rates may apply depending on your cellular provider plan.</li>
                        <li><strong>Opt-Out:</strong> You can cancel the SMS service at any time. Just text <strong>"STOP"</strong> to the shortcode or number sending the messages. After you send the SMS message "STOP" to us, we will send you an SMS message to confirm that you have been unsubscribed.</li>
                        <li><strong>Help:</strong> If at any time you forget what keywords are supported, just text <strong>"HELP"</strong>. After you send the SMS message "HELP" to us, we will respond with instructions on how to use our service as well as how to unsubscribe.</li>
                    </ul>
                    <p className="mt-4 text-sm mt-4">
                        For more detailed industry standards regarding SMS communications, you may review the <a href="https://help.twilio.com/articles/223134847-Industry-standards-for-US-Short-Code-Terms-of-Service" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Twilio SMS Terms of Use</a>. (Twilio Request — Add Terms of Service Page on Website for SMS).
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-foreground mb-4">4. Governing Law</h2>
                    <p>
                        These Terms shall be governed and construed in accordance with the laws of Massachusetts, United States, without regard to its conflict of law provisions.
                    </p>
                </section>
            </div>
        </div>
    );
}
