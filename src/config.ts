const FAVICON = '/logo.png'
const BASE_URL = 'https://corvush4ck.com'
const SITE_INFO = {
  title: 'Corvus DDoSKrom',
  author: 'Corvus DDoSKrom',
  language: 'es-ES',
  description: 'Pentester',
  startYear: 2025,
  endYear: new Date().getFullYear(),
  email: 'corvusddoskrom@gmail.com',
  baseUrl: BASE_URL + '/',
  avatarUrl: BASE_URL + '/favicon.svg',
  siteshotUrl: BASE_URL + '/siteshot.png',
}
const POST_PGAE_SIZE = 5
const DEFAULT_FRONTMATTER = {
  titleIcon: 'asset:feather,#4c4948|asset:feather,#c9c9d7',
  titleColor: '#4c4948|#c9c9d7',
  description: '暂无描述.',
  categories: ['未分类'],
  encrypt: {
    description: '这是一篇被加密的文章哟',
    placeholder: '输入密码'
  }
}
const SIDEBAR_SETTINGS = {
  name: "Corvus DDoSKrom",
  avatar: '/logo.png',
}
const ASIDE_CARDS = {
  info: {
    name: "Corvus DDoSKrom",
    link: '/',
    avatar: '/logo.png',
    descriptionLines: [
      "Pentester - Red Team - CTF Player",
      "E|HE / N|DE EC-Council",
    ]
  }
}
const NAV_ITEMS = [
  {
    icon: "mdi:post-outline",
    text: "BLOG",
    href: "/",
    children: [
      {
        icon: "mdi:archive",
        text: "ARCHIVOS",
        href: "/archives",
      },
      {
        icon: "mdi:folder-open",
        text: "CATEGORIA",
        href: "/categories"
      },
      {
        icon: "mdi:tag-multiple",
        text: "ETIQUETAS",
        href: "/tags"
      },
    ]
  },
//  {
//    icon: "mdi:account-box",
//    text: "SOBRE MI",
//    href: "/about",
//    children: [
//      {
//        icon: "mdi:account",
//        text: "SOBRE MI",
//        href: "/about"
//      }
//    ]
//  }
]

const FOOTER = {
  badgeGroups: [
    [
      
    ]
  ] satisfies Format[][]
}

export const FRIEND_LINK = {
  info: SITE_INFO,
  groups: friend_link_groups,
  siteshotPrefix: 'https://image.thum.io/get/width/400/crop/800/'
}

//======================================
;
import packageJson from '../package.json'
import type { Format } from 'badge-maker'
import friend_link_groups from './config.links'
import moment from 'moment'
moment.locale(SITE_INFO.language)
export { FAVICON, BASE_URL, SITE_INFO, POST_PGAE_SIZE, DEFAULT_FRONTMATTER, NAV_ITEMS, FOOTER, ASIDE_CARDS, SIDEBAR_SETTINGS }
