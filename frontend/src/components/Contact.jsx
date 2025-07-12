import { useState } from "react";
import {
  Card,
  CardContent,
  Button,
  TextField,
  Typography,
  Box,
  Paper,
  Grid,
} from "@mui/material";
import { Mail, Phone, LocationOn, AccessTime } from "@mui/icons-material";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
  };

  const handleInputChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      details: "hello@archrender.com",
      link: "mailto:hello@archrender.com",
    },
    {
      icon: Phone,
      title: "Phone",
      details: "+1 (555) 123-4567",
      link: "tel:+15551234567",
    },
    {
      icon: LocationOn,
      title: "Location",
      details: "New York, NY",
      link: "#",
    },
    {
      icon: AccessTime,
      title: "Hours",
      details: "Mon-Fri 9AM-6PM",
      link: "#",
    },
  ];

  return (
    <section id="contact" className="py-12 md:py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-16">
          <Typography
            variant="h3"
            component="h2"
            className="text-slate-900 mb-4 font-bold text-2xl sm:text-3xl md:text-4xl"
          >
            Get In Touch
          </Typography>
          <Typography
            variant="h6"
            className="text-gray-600 max-w-2xl mx-auto text-base md:text-xl"
          >
            Ready to start your project? Contact us for a free consultation
          </Typography>
        </div>

        <Grid container spacing={3} className="max-w-6xl mx-auto">
          <Grid item xs={12} lg={6}>
            <div className="space-y-6 md:space-y-8">
              <div className="space-y-4 md:space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <Paper className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <info.icon className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
                    </Paper>
                    <div>
                      <Typography
                        variant="h6"
                        className="font-semibold text-slate-900 mb-1 text-base md:text-lg"
                      >
                        {info.title}
                      </Typography>
                      <Typography
                        component="a"
                        href={info.link}
                        className="text-gray-600 hover:text-blue-600 transition-colors text-sm md:text-base no-underline"
                      >
                        {info.details}
                      </Typography>
                    </div>
                  </div>
                ))}
              </div>

              <Card className="border-0 shadow-lg bg-blue-600 text-white">
                <CardContent className="p-6 md:p-8">
                  <Typography
                    variant="h6"
                    className="font-semibold mb-4 text-lg md:text-xl"
                  >
                    Quick Response Guarantee
                  </Typography>
                  <Typography className="text-blue-100 text-sm md:text-base">
                    We respond to all inquiries within 2 hours during business
                    hours. Get your project quote fast!
                  </Typography>
                </CardContent>
              </Card>
            </div>
          </Grid>

          <Grid item xs={12} lg={6}>
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 md:p-8">
                <Typography variant="h5" className="mb-6 text-xl md:text-2xl">
                  Send us a message
                </Typography>

                <Box
                  component="form"
                  onSubmit={handleSubmit}
                  className="space-y-4 md:space-y-6"
                >
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Name"
                        value={formData.name}
                        onChange={handleInputChange("name")}
                        required
                        size="medium"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange("email")}
                        required
                        size="medium"
                      />
                    </Grid>
                  </Grid>

                  <TextField
                    fullWidth
                    label="Subject"
                    value={formData.subject}
                    onChange={handleInputChange("subject")}
                    required
                    size="medium"
                  />

                  <TextField
                    fullWidth
                    label="Message"
                    multiline
                    rows={5}
                    value={formData.message}
                    onChange={handleInputChange("message")}
                    required
                    size="medium"
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    fullWidth
                    className="bg-blue-600 hover:bg-blue-700 py-3 text-base md:text-lg"
                  >
                    Send Message
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
    </section>
  );
}
