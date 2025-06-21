import { Typography, Link, Grid, Box } from "@mui/material";
import { Business, Email, Phone, LocationOn } from "@mui/icons-material";

export default function Footer() {
  const footerLinks = {
    Services: [
      "Architectural Renders",
      "3D Visualization",
      "Interior Design",
      "Exterior Design",
      "Animation",
    ],
    Company: ["About Us", "Portfolio", "Pricing", "Contact", "Blog"],
    Support: [
      "Help Center",
      "File Formats",
      "Quality Guide",
      "Revisions",
      "FAQ",
    ],
  };

  return (
    <footer className="bg-slate-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <Grid container spacing={4} className="mb-8 md:mb-12">
          {/* Brand Section */}
          <Grid item xs={12} lg={4}>
            <div className="space-y-4 md:space-y-6">
              <Link
                href="/"
                className="flex items-center space-x-2 no-underline"
              >
                <Business className="h-6 w-6 md:h-8 md:w-8 text-white" />
                <Typography
                  variant="h6"
                  className="text-white font-bold text-lg md:text-xl"
                >
                  ArchRender
                </Typography>
              </Link>

              <Typography className="text-gray-300 leading-relaxed text-sm md:text-base">
                Professional architectural rendering services that bring your
                designs to life with stunning photorealistic quality.
              </Typography>

              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-gray-300">
                  <Email className="h-4 w-4" />
                  <Typography variant="body2">hello@archrender.com</Typography>
                </div>
                <div className="flex items-center space-x-2 text-gray-300">
                  <Phone className="h-4 w-4" />
                  <Typography variant="body2">+1 (555) 123-4567</Typography>
                </div>
                <div className="flex items-center space-x-2 text-gray-300">
                  <LocationOn className="h-4 w-4" />
                  <Typography variant="body2">New York, NY</Typography>
                </div>
              </div>
            </div>
          </Grid>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <Grid item xs={12} sm={6} lg={2.67} key={category}>
              <div className="space-y-3 md:space-y-4">
                <Typography
                  variant="h6"
                  className="text-white font-semibold text-base md:text-lg"
                >
                  {category}
                </Typography>
                <ul className="space-y-2 list-none p-0">
                  {links.map((link) => (
                    <li key={link}>
                      <Link
                        href="#"
                        className="text-gray-300 hover:text-white transition-colors no-underline text-sm md:text-base"
                        sx={{
                          "&:hover": {
                            color: "white",
                          },
                        }}
                      >
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </Grid>
          ))}
        </Grid>
        <div className="border-t border-gray-700 pt-8 md:pt-12">
          <Typography variant="body2" className="text-gray-300 text-center">
            &copy; {new Date().getFullYear()} ArchRender. All rights reserved.
          </Typography>
        </div>
      </div>
    </footer>
  );
}
