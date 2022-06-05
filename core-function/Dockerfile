FROM public.ecr.aws/lambda/nodejs:16 as base-node

ENV LANG en_US.UTF-8
ENV LANGUAGE en_US:en

RUN yum upgrade -y && yum clean all && rm -rf /var/cache/yum

FROM base-node as build-node

ADD package.json ./

RUN npm i

ADD ./ .
RUN ls -la

RUN npm run build:dev && ls -la ./

FROM base-node as run-node

COPY --from=build-node ${LAMBDA_TASK_ROOT}/dist/* ./

CMD ["function.healthcheck"]
