import unittest
from smoke import trace_services

class TraceCorrelationTest(unittest.TestCase):
    def resource(self, service, trace):
        return {'resource': {'attributes': [{'key':'service.name', 'value':{'stringValue':service}}]}, 'scopeSpans':[{'spans':[{'traceId':trace}]}]}

    def test_groups_services_only_when_trace_id_matches(self):
        payload = {'result': {'resourceSpans':[self.resource('auth-service','same'), self.resource('user-service','same'), self.resource('admin-service','other')]}}
        groups = trace_services(payload)
        self.assertEqual(groups['same'], {'auth-service','user-service'})
        self.assertEqual(groups['other'], {'admin-service'})

    def test_empty_response_cannot_prove_trace_export(self):
        self.assertEqual(trace_services({'result': {}}), {})

if __name__ == '__main__': unittest.main()
