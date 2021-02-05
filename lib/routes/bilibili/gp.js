/*
const got = require('@/utils/got');
const cheerio = require('cheerio');
const iconv = require('iconv-lite');

module.exports = async (ctx) => {
    const host = `https://cn.investing.com/news/stock-market-news`;

    const response = await got.get(host, {
        responseType: 'buffer',
    });

    response.data = iconv.decode(response.data, 'gbk');
    const $ = cheerio.load(response.data);

    const list = $("#QBS_2_inner tr").get();

    const items = list.map((item) => {
        item = $(item);

        return {
            title: item.find("td").next().html(),
            description: item.find("td").get(1).tagName,
            link: `https://zhidao.baidu.com/${item.find("td").get(2).tagName}`,
        };
    });

    const result = await Promise.all(
        items.map(async (item) => {
            const link = item.link;

            const cache = await ctx.cache.get(link);
            if (cache) {
                return Promise.resolve(JSON.parse(cache));
            }

            const itemReponse = await got.get(link, {
                responseType: 'buffer',
            });
            const data = iconv.decode(itemReponse.data, 'gbk');
            const itemElement = cheerio.load(data);

            item.description = itemElement('.detail-wp').html();

            ctx.cache.set(link, JSON.stringify(item));
            return Promise.resolve(item);
        })
    );

    ctx.state.data = {
        title: `知道日报`,
        link: host,
        description: `每天都知道一点`,
        item: result,
    };
};

*/


const got = require('@/utils/got');
const cheerio = require('cheerio');
const url = require('url');

const host = 'https://www.zhihu.com';


module.exports = async (ctx) => {
    const link = 'https://cn.investing.com/news/stock-market-news';
    const response = await got.get(link);
    const $ = cheerio.load(response.data);

    //const description = $('p.Weekly-description').text();
    const out = $("#QBS_2_inner tr").get()
        .slice(0, 10)
        .map(function () {
            const info = {
                title: $(this).html(),
                link: "url.resolve(host, $(this).find('a').attr('href'))",
                description: $(this).html(),
                author: $(this).html(),
            };
            return info;
        })
        .get();

    ctx.state.data = {
        title: '知乎周刊',
        link: link,
        description: 'description',
        item: out,
    };
};
