import { Helmet } from "react-helmet-async";

import PageTitle from "../components/Layout/PageTitle";

const Update = () => {
    return (
        <div className="my-2">
            <Helmet>
                <title>One Final Update</title>
                <link
                    rel="canonical"
                    href="https://recommendations.victorverma.com/update"
                />
            </Helmet>

            <PageTitle title="One Final Update" />

            <div className="w-4/5 sm:w-3/5 min-w-24 sm:min-w-96 mt-12 mx-auto flex flex-col space-y-4">
                <h2 className="text-bold text-xl sm:text-2xl decoration-palette-darkbrown">
                    January 22, 2026
                </h2>
                <p className="text-xs sm:text-sm rounded-md">
                    Unfortunately, this website has been shut down indefinitely.
                    In December 2025, Letterboxd updated their{" "}
                    <a
                        className="underline shadow-sm hover:decoration-palette-darkbrown hover:opacity-75"
                        href="https://letterboxd.com/legal/terms-of-use/"
                        target="_blank"
                    >
                        terms of service
                    </a>{" "}
                    and prohibited any automated data collection from their
                    website (section 6.11). Previously, they had no specific
                    policy, so I was able to leverage the gray area to gather
                    movie data and user ratings with plausible deniability.
                    Under this new provision, however, Letterboxd would be
                    empowered to take legal action against my site if it
                    remained operational. As a film fan, I love Letterboxd, and
                    I totally understand and respect their decision to protect
                    their content.
                </p>
                <p className="text-xs sm:text-sm rounded-md">
                    For those who don't know, this website was a passion project
                    that I initially started in my sophomore year of college to
                    help my roommate and I decide which movie to watch next.
                    Nearly 3 years later, it's staggering to see that this
                    website was used <strong>57,901</strong> times by{" "}
                    <strong>13,447</strong> unique users across{" "}
                    <strong>139</strong> countries. Whether you're one of the 47
                    people who've used my site over 100 times, or someone who
                    used it just once, I'm so grateful for all of the support.
                </p>
                <p className="text-xs sm:text-sm rounded-md">
                    I want to take a moment to share what I had envisioned for
                    the future of this site. I'm going to graduate school this
                    fall to pursue an M.S. in Computer Science, and I plan to
                    complete a thesis that explores how modern natural language
                    processing techniques can be used to improve recommender
                    systems. My goal was to eventually integrate my research
                    into this site and create an improved recommendation model
                    that better understood the user's film preferences by
                    incorporating their Letterboxd reviews alongside their
                    ratings.
                </p>
                <p className="text-xs sm:text-sm rounded-md">
                    Again, I'd like to thank everyone who helped make my passion
                    project into a reality. If anyone has any questions, is
                    interested in learning more about my experience building
                    this website, or even just wants to talk, feel free to
                    connect with me on{" "}
                    <a
                        className="underline shadow-sm hover:decoration-palette-darkbrown hover:opacity-75"
                        href="https://www.linkedin.com/in/victorverma"
                        target="_blank"
                    >
                        LinkedIn
                    </a>
                    . Many of you already have!
                </p>
                <p className="text-xs sm:text-sm rounded-md">
                    Sincerely, <br />
                    Victor Verma
                </p>
            </div>
        </div>
    );
};

export default Update;
