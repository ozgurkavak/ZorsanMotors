"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MapPin, Phone, Mail, Clock, CheckCircle2 } from "lucide-react";
import { sendContactMessage } from "@/app/actions/contact";

export default function ContactPage() {
    const [sending, setSending] = useState(false);
    const [success, setSuccess] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);

    async function handleSubmit(formData: FormData) {
        setSending(true);
        const result = await sendContactMessage(formData);
        setSending(false);

        if (result?.success) {
            setSuccess(true);
            formRef.current?.reset();
        } else {
            alert("Something went wrong. Please check your inputs.");
        }
    }

    return (
        <div className="container max-w-7xl mx-auto py-12 md:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                {/* Contact Info & Map */}
                <div className="space-y-8">
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tight">Contact Us</h1>
                        <p className="text-muted-foreground mt-4 text-lg">
                            Have questions about a vehicle or need help with financing?
                            Visit our showroom or get in touch with our team today.
                        </p>
                    </div>

                    <div className="grid gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MapPin className="h-5 w-5 text-primary" /> Location
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="font-medium">8 Montello St</p>
                                <p className="text-muted-foreground">Brockton, MA 02301</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Phone className="h-5 w-5 text-primary" /> Phone
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <a href="tel:7813004796" className="text-xl font-bold text-primary hover:underline">
                                    (781) 300-4796
                                </a>
                                <p className="text-sm text-muted-foreground mt-1">Available Mon-Sat, 9am - 7pm</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Google Map Embed */}
                    <div className="rounded-xl overflow-hidden border shadow-sm h-[300px] bg-muted relative">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2962.469145974643!2d-71.02100892346766!3d42.08051697122046!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89e49b8af2c3519b%3A0xe5a3c0e3523bd095!2s8%20Montello%20St%2C%20Brockton%2C%20MA%2002301!5e0!3m2!1sen!2sus!4v1704928000000!5m2!1sen!2sus"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="lg:pl-8">
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle>Send us a Message</CardTitle>
                            <CardDescription>Fill out the form below and we'll get back to you as soon as possible.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {success ? (
                                <div className="flex flex-col items-center justify-center py-12 text-center animate-in fade-in">
                                    <div className="mb-4 rounded-full bg-green-100 p-3 text-green-600 dark:bg-green-900/30">
                                        <CheckCircle2 className="h-8 w-8" />
                                    </div>
                                    <h3 className="text-2xl font-bold">Message Sent!</h3>
                                    <p className="text-muted-foreground mt-2 max-w-xs">
                                        Your message has been sent to sales@zorsanmotors.com. We'll be in touch shortly.
                                    </p>
                                    <Button className="mt-6" variant="outline" onClick={() => setSuccess(false)}>
                                        Send Another
                                    </Button>
                                </div>
                            ) : (
                                <form action={handleSubmit} ref={formRef} className="space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="firstName">First name</Label>
                                            <Input id="firstName" name="firstName" required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="lastName">Last name</Label>
                                            <Input id="lastName" name="lastName" required />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input id="email" name="email" type="email" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone</Label>
                                        <Input id="phone" name="phone" type="tel" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="message">Message</Label>
                                        <Textarea
                                            id="message"
                                            name="message"
                                            className="min-h-[150px]"
                                            required
                                        />
                                    </div>
                                    <Button className="w-full" size="lg" disabled={sending}>
                                        {sending ? "Sending Message..." : "Send Message"}
                                    </Button>
                                </form>
                            )}
                        </CardContent>
                    </Card>
                </div>

            </div>
        </div>
    );
}
