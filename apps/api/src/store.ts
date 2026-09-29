import {DynamoDBClient} from '@aws-sdk/client-dynamodb';
import {DynamoDBDocumentClient,GetCommand,PutCommand,QueryCommand} from '@aws-sdk/lib-dynamodb';
import {fixture,Passport,ProductEvent} from './domain.js';
const client=DynamoDBDocumentClient.from(new DynamoDBClient({})); const table=process.env.TABLE_NAME;
const memory=new Map<string,Passport>();
export async function getPassport(tenantId:string,id:string):Promise<Passport>{ if(!table) return memory.get(`${tenantId}:${id}`) ?? fixture(tenantId,id); const r=await client.send(new GetCommand({TableName:table,Key:{pk:`TENANT#${tenantId}`,sk:`PASSPORT#${id}`}})); return (r.Item as Passport|undefined) ?? fixture(tenantId,id); }
export async function savePassport(p:Passport){ if(!table){memory.set(`${p.tenantId}:${p.id}`,p);return;} await client.send(new PutCommand({TableName:table,Item:{pk:`TENANT#${p.tenantId}`,sk:`PASSPORT#${p.id}`,...p}})); }
export async function addEvent(e:ProductEvent){ if(!table)return; await client.send(new PutCommand({TableName:table,Item:{pk:`TENANT#${e.tenantId}`,sk:`EVENT#${e.at}#${e.id}`,...e}})); }
export async function listEvents(tenantId:string,id:string){ if(!table)return (memory.get(`${tenantId}:${id}`)?.events??[]); const r=await client.send(new QueryCommand({TableName:table,KeyConditionExpression:'pk = :pk AND begins_with(sk, :sk)',ExpressionAttributeValues:{':pk':`TENANT#${tenantId}`,':sk':'EVENT#'}})); return (r.Items??[]) as ProductEvent[]; }
