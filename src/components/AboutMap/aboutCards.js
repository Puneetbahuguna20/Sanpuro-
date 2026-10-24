// Edit the text of the detail cards here.
// body: a list of blocks. { p: 'text' } is a paragraph, { list: ['a', 'b'] } is an arrow list.

const aboutCards = {
  who: {
    label: '01 · Who we are',
    title: 'A small studio building meaningful solutions',
    body: [
      { p: 'SanPuRo helps businesses turn ideas into reliable digital products. We build custom software, modern websites, mobile applications, and automation solutions designed around real business needs. Based in Delhi, India, we focus on practical technology, thoughtful design, and solutions built to work.' },
    ],
  },
  build: {
    label: '02 · What we build',
    title: 'From websites to whole systems',
    body: [
      { list: ['Websites and landing pages', 'Mobile apps for Android and iOS', 'Custom software and dashboards', 'Business automation and integrations'] },
    ],
  },
  how: {
    label: '03 · How we work',
    title: 'Five clear steps',
    body: [
      { list: ['Plan: goals, scope and a fixed quote', 'Design: screens you can click before we build', 'Build: weekly updates you can see', 'Launch: testing, hosting and handover', 'Support: we stay after go-live'] },
    ],
  },
  why: {
    label: '04 · Why Sanpuro',
    title: 'One team, start to finish',
    body: [
      { p: 'You talk to the people who design and build your product. No hand-offs, no hidden costs, and plain answers to every question.' },
    ],
  },
  stack: {
    label: '05 · Our stack',
    title: 'Proven, modern tools',
    body: [
      { list: ['[React, Next.js]', '[Node.js, Python]', '[Flutter / React Native]', '[AWS / Vercel / Firebase]'] },
    ],
  },
  values: {
    label: '06 · Values',
    title: 'What we hold on to',
    body: [
      { list: ['Honest design: useful before pretty', 'Clean code: easy to grow later', 'Real results: we measure what matters'] },
    ],
  },
};

export default aboutCards;
