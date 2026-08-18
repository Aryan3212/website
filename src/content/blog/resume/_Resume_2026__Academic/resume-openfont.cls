% Intro Options
\ProvidesClass{resume-openfont}[2021/05/30 Abdullah's version]
\NeedsTeXFormat{LaTeX2e}
\DeclareOption{print}{\def\@cv@print{}}
\DeclareOption*{%
    \PassOptionsToClass{\CurrentOption}{article}
}
\ProcessOptions\relax
\LoadClass{article}

%--------------------------------------------------------------
% Package Imports
\RequirePackage[english]{babel}
% page setup 
\RequirePackage{fancyhdr}
% Set boundaries
\RequirePackage[hmargin=1.2cm, vmargin=0.94cm]{geometry}
% remove ugly boxes around links
\usepackage[hidelinks]{hyperref}
% setup custom titles
\RequirePackage{titlesec}
% For skills table
\RequirePackage{enumitem}
% Using tables like the profile section
\RequirePackage{tabularx}
% Used for the link symbol
\RequirePackage{fontawesome5}
% Set up font 
\RequirePackage{lato-font}
% make underlying constants: credits to Alex Beattie for noticing and suggesting fix
\RequirePackage{ulem}
%--------------------------------------------------------------
% Reformatting default sections
% section
\titlespacing{\section}{0pt}{0pt}{0pt}
\titleformat{\section}{%
\color{section}% Using comments to allow us to split the command across multiple line
\customLatoBold%
\fontsize{10pt}{11pt}%first number is size, second number is space between lines
\selectfont%
\raggedright%
\uppercase%
} {}{0em}{}

% subsection
\titlespacing{\subsection}{0pt}{\parskip}{-\parskip}
\titleformat{\subsection}{%
\color{subheadings}%
\customLatoBlack%
\fontsize{10pt}{11pt}%
\selectfont%
\bfseries%
\uppercase%
\normalfont% Normal font is used to reset the customization, so it doesn't bleed into anything else
} {}{0em}{}

% remove header footer stuff like page numbers 
\newcommand{\resetHeaderAndFooter}{%
\fancyhf{}%
\fancyfoot{}%
\renewcommand{\headrulewidth}{0pt}%
\renewcommand{\footrulewidth}{0pt}%
}
%--------------------------------------------------------------
% Formatting commands - commands to control spacing

% A shortcut to control spacing
\newcommand{\NoSpace}{\vspace*{-2pt}}

% Command to align table at the start of the resume
\newcommand{\alignProfileTable}{
    \raggedbottom
    \raggedright
    \setlength{\tabcolsep}{0in}
}

%--------------------------------------------------------------
% Subheadings command - create different types of heading
\newcommand{\runsubsection}[1]{%
\color{subheadings}%
\customLatoBold%
\fontsize{10pt}{11pt}%
\selectfont{#1}%
\normalfont%
}%

% Descriptors command
\newcommand{\descript}[1]{%
\color{subheadings}%
\raggedright%
\customLatoRegular%
\fontsize{9.35pt}{11pt}%
\selectfont{#1}%
\normalfont%
\normalsize%
}%

\newcommand{\location}[1]{
\color{subheadings}\raggedright \customLatoItalic \fontsize{9.35pt}{11pt}\selectfont {#1\\}\normalfont\normalsize}
% Projects command
\newcommand{\Project}[2]{
\runsubsection{\underlinedLink{#2}{#1}}}
\newcommand{\ProjectWithoutLink}[1]{\runsubsection{#1}}
% Underlined link command
\newcommand{\underlinedLink}[2]{%
\href{#1}{\uline{#2}}%
}
%--------------------------------------------------------------
% Section separators command
\newcommand{\sectionsep}[0]{\vspace{6pt}}

%--------------------------------------------------------------
% Bullet Lists with fewer gaps command
\newenvironment{bullets}{%
\vspace{-1.5mm}
\begin{itemize}
\itemsep1pt 
\parskip1pt 
\parsep1pt
\fontsize{9.35pt}{11pt}
\selectfont
}
{
\normalfont
\normalsize
\end{itemize}
\vspace{-\topsep}
}
% Modifying Bullet points
\setlist[itemize]{label=\textbullet, left=0.5em}


%--------------------------------------------------------------
% Customize built-in commands
% Align Sections
\let\oldSection\section
\renewcommand{\section}[1]{\oldSection{#1}\raggedright}
\renewcommand{\underline}[1]{\uline{#1}}