export const GET_METRICS = ({ slug, from, to, interval }: {
  slug: string,
  from: string,
  to: string,
  interval: string
}) => `query {
    getMetric(metric: "price_usd") {
      data: timeseriesData(
        selector: { slug: "${slug}" }
        from: "${from}"
        to: "${to}"
        interval: "${interval}"
      ) {
        d: datetime
        v: value
      }
    }
  }`;

